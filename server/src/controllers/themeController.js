import { ThemeSettings } from "../models/ThemeSettings.js";
import { ensureDefaultDocuments } from "../utils/ensureDefaults.js";

export const getTheme = async (req, res) => {
  await ensureDefaultDocuments();
  const theme = await ThemeSettings.findOne();
  return res.json(theme);
};

export const updateTheme = async (req, res) => {
  await ensureDefaultDocuments();
  const theme = await ThemeSettings.findOne();
  Object.assign(theme, req.body);
  await theme.save();
  return res.json(theme);
};

