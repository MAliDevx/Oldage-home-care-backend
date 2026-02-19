const Gallery = require("../models/gallery.model");
const cloudinary = require("../config/cloudinary");

/* ================= CREATE GALLERY ITEM ================= */
exports.createGalleryItem = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name and category are required"
      });
    }

    if (!['events', 'residents', 'activities'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Category must be one of: events, residents, activities"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    // With multer-storage-cloudinary:
    // - req.file.path is the hosted URL (usually secure_url)
    // - req.file.filename is the Cloudinary public_id
    const imageUrl = req.file.path;
    const imagePublicId = req.file.filename;

    const galleryItem = await Gallery.create({
      name,
      description: description || "",
      imageUrl,
      imagePublicId,
      category
    });

    res.status(201).json({
      success: true,
      message: "Gallery item created successfully",
      data: galleryItem
    });

  } catch (error) {
    // If DB fails after upload, try to clean up Cloudinary asset
    if (req.file?.filename) {
      try { await cloudinary.uploader.destroy(req.file.filename); } catch (_) {}
    }

    res.status(500).json({
      success: false,
      message: "Failed to create gallery item",
      error: error.message
    });
  }
};

/* ================= GET ALL GALLERY ITEMS ================= */
exports.getAllGalleryItems = async (req, res) => {
  try {
    const galleryItems = await Gallery.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: galleryItems.length,
      data: galleryItems
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch gallery items",
      error: error.message
    });
  }
};

/* ================= GET SINGLE GALLERY ITEM ================= */
exports.getGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const galleryItem = await Gallery.findById(id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found"
      });
    }

    res.status(200).json({
      success: true,
      data: galleryItem
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch gallery item",
      error: error.message
    });
  }
};

/* ================= UPDATE GALLERY ITEM ================= */
exports.updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category } = req.body;

    const galleryItem = await Gallery.findById(id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found"
      });
    }

    // Update fields if provided
    if (name) galleryItem.name = name;
    if (description !== undefined) galleryItem.description = description;
    if (category) {
      if (!['events', 'residents', 'activities'].includes(category)) {
        return res.status(400).json({
          success: false,
          message: "Category must be one of: events, residents, activities"
        });
      }
      galleryItem.category = category;
    }

    // Handle image update if new file is uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (galleryItem.imagePublicId) {
        await cloudinary.uploader.destroy(galleryItem.imagePublicId);
      }

      galleryItem.imageUrl = req.file.path;
      galleryItem.imagePublicId = req.file.filename;
    }

    await galleryItem.save();

    res.status(200).json({
      success: true,
      message: "Gallery item updated successfully",
      data: galleryItem
    });

  } catch (error) {
    // If DB fails after new upload, try to clean up the newly uploaded Cloudinary asset
    if (req.file?.filename) {
      try { await cloudinary.uploader.destroy(req.file.filename); } catch (_) {}
    }

    res.status(500).json({
      success: false,
      message: "Failed to update gallery item",
      error: error.message
    });
  }
};

/* ================= DELETE GALLERY ITEM ================= */
exports.deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const galleryItem = await Gallery.findById(id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found"
      });
    }

    // Delete image from Cloudinary
    if (galleryItem.imagePublicId) {
      await cloudinary.uploader.destroy(galleryItem.imagePublicId);
    }

    await Gallery.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Gallery item deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete gallery item",
      error: error.message
    });
  }
};

