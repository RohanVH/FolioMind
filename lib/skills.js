import { connectDb } from "./db.js";
import { ok } from "./api.js";
import { Skill } from "../server/src/models/Skill.js";

const getCategoryRank = (category = "") => {
  const normalized = String(category || "").trim().toLowerCase();
  if (normalized === "frontend" || normalized.includes("front")) return 1;
  if (normalized === "backend" || normalized.includes("back")) return 2;
  if (normalized === "database" || normalized.includes("data")) return 3;
  if (normalized === "ai" || normalized.includes("ml")) return 4;
  if (normalized === "tools" || normalized.includes("tool")) return 5;
  return 999;
};

export const getSkillsResponse = async (req, res) => {
  try {
    await connectDb();
    const skills = await Skill.find().lean();
    const safeSkills = Array.isArray(skills) ? skills : [];
    safeSkills.sort((a, b) => {
      const categoryDiff = getCategoryRank(a?.category) - getCategoryRank(b?.category);
      if (categoryDiff !== 0) return categoryDiff;
      const categoryNameDiff = String(a?.category || "").localeCompare(String(b?.category || ""));
      if (categoryNameDiff !== 0) return categoryNameDiff;
      const orderDiff = Number(a?.order ?? 0) - Number(b?.order ?? 0);
      if (orderDiff !== 0) return orderDiff;
      return String(a?.name || "").localeCompare(String(b?.name || ""));
    });
    return ok(res, safeSkills);
  } catch (error) {
    console.error("SKILLS ERROR:", error);
    return ok(res, []);
  }
};
