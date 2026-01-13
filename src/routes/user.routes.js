const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const { getAllUsers } = require("../controllers/user.controller");
const { getUserProfile,updateUserProfile } = require("../controllers/profile.controller");
const {User} = require("../models/user.model"); // Make sure this is correct

router.get("/", protect, getAllUsers);
// router.get("/profile", protect, getUserProfile);
// router.get("/profile/:userId", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/profile", protect, getUserProfile);




module.exports = router;
