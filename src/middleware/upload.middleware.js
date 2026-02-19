const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const allowedDocumentType = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "old-age-home",
      resource_type: "image",
      format: undefined, // keep original if possible
      public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`
    };
  }
});

const fileFilter = (req, file, cb) => {
  if (allowedDocumentType.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = upload;
