import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    skill: {
      type: String,
      required: true,
      trim: true
    },
    certificate_link: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      required: false,
      trim: true
    },
    date: {
      type: Date,
      required: false
    },
    visible: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export const Certificate = mongoose.model("Certificate", certificateSchema);
