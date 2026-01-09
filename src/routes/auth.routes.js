const express = require("express");
const router = express.Router();
const { registerUser, loginUser,forgotPassword,resetPassword,verifyOTP } = require("../controllers/auth.controller");
const protect = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const {uploadProfilePic}=require("../controllers/upload.controller");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-otp", verifyOTP);

router.post(
  "/upload",
  upload.array("file", 5), 
  uploadProfilePic
);


router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;
