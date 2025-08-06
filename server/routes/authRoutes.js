const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  googleLogin,
  sendVerificationEmail,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getUserProfile,
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);

router.post("/send-verification-email", protect, sendVerificationEmail);
router.get("/verify-email/:token", verifyEmail);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/profile", protect, getUserProfile);

module.exports = router;
