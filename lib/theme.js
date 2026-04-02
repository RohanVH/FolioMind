import { connectDb } from "./db.js";
import { ok } from "./api.js";
import { ThemeSettings } from "../server/src/models/ThemeSettings.js";
import { ensureDefaultDocuments } from "../server/src/utils/ensureDefaults.js";

const fallbackTheme = {
  primaryColor: "#22c55e",
  accentColor: "#38bdf8",
  backgroundColor: "#020617",
  mode: "dark",
  font: "Space Grotesk"
};

export const getThemeResponse = async (req, res) => {
  try {
    await connectDb();
    await ensureDefaultDocuments();
    const theme = await ThemeSettings.findOne().lean();
    return ok(res, theme || fallbackTheme);
  } catch (error) {
    console.error("THEME ERROR:", error);
    return ok(res, fallbackTheme);
  }
};
