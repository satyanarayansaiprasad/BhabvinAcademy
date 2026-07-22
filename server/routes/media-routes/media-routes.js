const express = require("express");
const multer = require("multer");
const { uploadMediaToCloudinary, deleteMediaFromCloudinary } = require("../../helpers/cloudinary");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max file size limit
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded!",
      });
    }

    // Check if Cloudinary credentials exist
    const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                          process.env.CLOUDINARY_API_KEY && 
                          process.env.CLOUDINARY_API_SECRET;

    if (hasCloudinary) {
      try {
        const base64File = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        const result = await uploadMediaToCloudinary(base64File);
        return res.status(200).json({
          success: true,
          data: result,
        });
      } catch (cloudErr) {
        console.warn("Cloudinary upload failed, falling back to Data URI:", cloudErr.message);
      }
    }

    // Resilient Fallback: Convert file buffer to Data URI string
    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    return res.status(200).json({
      success: true,
      data: {
        url: dataUri,
        public_id: `file_${Date.now()}`,
      },
    });
  } catch (error) {
    console.error("Media upload route error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading media file",
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Asset id is required",
      });
    }

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        await deleteMediaFromCloudinary(id);
      } catch (err) {
        console.warn("Cloudinary delete failed:", err.message);
      }
    }

    res.status(200).json({
      success: true,
      message: "Asset deleted successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error deleting media file",
    });
  }
});

module.exports = router;
