const express = require("express");
const router = express.Router();
const {
  createGalleryItem,
  getAllGalleryItems,
  getGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} = require("../controllers/gallery.controller");
const protect = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// Public routes
router.get("/", getAllGalleryItems);
router.get("/:id", getGalleryItem);

// Protected routes (Admin only)
router.post("/", protect, upload.single("image"), createGalleryItem);
router.put("/:id", protect, upload.single("image"), updateGalleryItem);
router.delete("/:id", protect, deleteGalleryItem);

module.exports = router;

