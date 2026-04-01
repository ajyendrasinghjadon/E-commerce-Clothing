const mongoose = require("mongoose");

const siteConfigSchema = new mongoose.Schema(
  {
    heroImage: {
      url: { type: String },
      altText: { type: String, default: "Hero Image" },
    },
    womensCollectionImage: {
      url: { type: String },
      altText: { type: String, default: "Women's Collection" },
    },
    mensCollectionImage: {
      url: { type: String },
      altText: { type: String, default: "Men's Collection" },
    },
    aboutUsHeroImage: {
      url: { type: String },
      altText: { type: String, default: "About Us Hero" },
    },
    aboutUsStoryImage: {
      url: { type: String },
      altText: { type: String, default: "Our Story" },
    },
    aboutUsBrandImage: {
      url: { type: String },
      altText: { type: String, default: "Brand Story" },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("SiteConfig", siteConfigSchema);
