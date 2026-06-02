const express = require("express");
const multer = require("multer");
const {
  uploadMediaToCloudinaryFromBuffer,
  deleteMediaFromCloudinary,
} = require("../../helpers/cloudinary");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload single file
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const result = await uploadMediaToCloudinaryFromBuffer(req.file.buffer);
    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error) {
    console.error("Error uploading media:", error);
    res.status(500).json({ success: false, message: "Error uploading file", error: error.message });
  }
});

// Bulk upload files
router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }
    const uploadPromises = req.files.map(file => uploadMediaToCloudinaryFromBuffer(file.buffer));
    const results = await Promise.all(uploadPromises);
    const data = results.map(result => ({
      url: result.secure_url,
      public_id: result.public_id,
    }));
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error bulk uploading media:", error);
    res.status(500).json({ success: false, message: "Error uploading files", error: error.message });
  }
});

// Delete media
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "Asset public ID is required" });
    }
    await deleteMediaFromCloudinary(id);
    res.status(200).json({
      success: true,
      message: "Asset deleted successfully from Cloudinary",
    });
  } catch (error) {
    console.error("Error deleting media:", error);
    res.status(500).json({ success: false, message: "Error deleting asset", error: error.message });
  }
});

module.exports = router;
