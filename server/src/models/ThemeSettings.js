import mongoose from "mongoose";

const themeSettingsSchema = new mongoose.Schema(
  {
    primaryColor: { type: String, default: "#22c55e" },
    accentColor: { type: String, default: "#38bdf8" },
    backgroundColor: { type: String, default: "#020617" },
    mode: { type: String, enum: ["dark", "light"], default: "dark" },
    font: { type: String, default: "Space Grotesk" }
  },
  { timestamps: true }
);

export const ThemeSettings = mongoose.model("ThemeSettings", themeSettingsSchema);

