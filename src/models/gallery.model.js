const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  imagePublicId: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['events', 'residents', 'activities'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = Gallery;

