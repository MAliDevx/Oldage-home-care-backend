const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const galleryRoutes = require("./gallery.routes");

router.use("/admin", authRoutes);
router.use("/gallery", galleryRoutes);

module.exports = router;
