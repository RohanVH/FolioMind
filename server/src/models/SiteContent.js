import mongoose from "mongoose";

const aboutSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 }
  },
  { _id: false }
);

const heroImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 }
  },
  { _id: false }
);

const siteContentSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, default: "Rohan Sharma" },
    heroSubtitle: { type: String, default: "Full Stack Developer building AI-native products." },
    heroIntro: { type: String, default: "I design robust full stack systems with production quality." },
    aboutText: {
      type: String,
      default: "I am a full stack developer focused on React, Node.js, and AI integrations."
    },
    aboutSections: {
      type: [aboutSectionSchema],
      default: []
    },
    heroImages: {
      type: [heroImageSchema],
      default: []
    },
    resumeLink: { type: String, default: "" },
    resumePublicId: { type: String, default: "" },
    contactEmail: { type: String, default: "hello@example.com" },
    github: { type: String, default: "" },
    hackerrank: { type: String, default: "https://www.hackerrank.com/profile/rohanvaradaraju1" }
  },
  { timestamps: true }
);

export const SiteContent = mongoose.model("SiteContent", siteContentSchema);
