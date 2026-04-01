const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const SiteConfig = require("../models/SiteConfig");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @route GET /api/site-config
// @desc Get site configuration
// @access Public
router.get("/", async (req, res) => {
  try {
    let config = await SiteConfig.findOne();
    if (!config) {
      // If no config exists, create an empty one (or use defaults)
      config = new SiteConfig({});
      await config.save();
    }
    res.json(config);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// @route PATCH /api/site-config
// @desc Update site configuration
// @access Private/Admin
router.patch("/", protect, admin, upload.single("image"), async (req, res) => {
  try {
    const { field, altText } = req.body;
    let config = await SiteConfig.findOne();
    if (!config) {
        config = new SiteConfig({});
    }

    // Determine target field
    const allowedFields = [
      "heroImage", 
      "womensCollectionImage", 
      "mensCollectionImage", 
      "aboutUsHeroImage", 
      "aboutUsStoryImage", 
      "aboutUsBrandImage"
    ];
    
    if (!allowedFields.includes(field)) {
      return res.status(400).json({ message: "Invalid field provided" });
    }

    let imageUrl = config[field]?.url;

    // If a new image file is uploaded, upload it to Cloudinary
    if (req.file) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) resolve(result.secure_url);
          else reject(error);
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    }

    // Update the config field
    config[field] = {
        url: imageUrl,
        altText: altText || config[field]?.altText || "Site Image"
    };

    await config.save();
    res.json(config);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
