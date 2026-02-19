const Gallery = require("../models/gallery.model");
const path = require("path");
const fs = require("fs");

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

    const imagePath = `/uploads/${req.file.filename}`;

    const galleryItem = await Gallery.create({
      name,
      description: description || "",
      image: imagePath,
      category
    });

    res.status(201).json({
      success: true,
      message: "Gallery item created successfully",
      data: galleryItem
    });

  } catch (error) {
    // Delete uploaded file if database operation fails
    if (req.file) {
      const filePath = path.join(process.cwd(), "src", "uploads", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
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
      // Delete old image file
      const oldImagePath = path.join(process.cwd(), "src", galleryItem.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      galleryItem.image = `/uploads/${req.file.filename}`;
    }

    await galleryItem.save();

    res.status(200).json({
      success: true,
      message: "Gallery item updated successfully",
      data: galleryItem
    });

  } catch (error) {
    // Delete uploaded file if database operation fails
    if (req.file) {
      const filePath = path.join(process.cwd(), "src", "uploads", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
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

    // Delete image file
    const imagePath = path.join(process.cwd(), "src", galleryItem.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
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

