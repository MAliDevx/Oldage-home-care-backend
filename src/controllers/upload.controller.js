const message = require('../utils/variables')

exports.uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: message.fileUploadedError });
    }

    res.status(200).json({
      message: message.fileUploadedSuccess,
      file: {
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
