const express = require("express");
const {
  registerUser,
  registerSubAdmin,
  loginUser,
  forgotPassword,
  resetPassword,
  updateUserProfile,
} = require("../../controllers/auth-controller/index");
const authenticateMiddleware = require("../../middleware/auth-middleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/register-sub-admin", authenticateMiddleware, registerSubAdmin);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/update-profile", authenticateMiddleware, updateUserProfile);
router.get("/check-auth", authenticateMiddleware, (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    data: {
      user,
    },
  });
});

module.exports = router;
