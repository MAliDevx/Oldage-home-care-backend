const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const { getAllUsers } = require("../controllers/user.controller");
const { getUserProfile,updateUserProfile } = require("../controllers/profile.controller");

router.get("/", protect, getAllUsers);
router.get("/profile", protect, getUserProfile);
router.get("/profile/:userId", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);




module.exports = router;
