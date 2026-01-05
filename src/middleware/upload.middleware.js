const multer = require("multer");

const allowedDocumentType = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (allowedDocumentType) {
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
