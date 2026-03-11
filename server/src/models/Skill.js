import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    categoryOrder: { type: Number, default: 999 },
    icon: { type: String, trim: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Skill = mongoose.model("Skill", skillSchema);
