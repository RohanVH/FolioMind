import { Skill } from "../models/Skill.js";

const DEFAULT_CATEGORY_ORDER = {
  frontend: 1,
  backend: 2,
  database: 3,
  ai: 4,
  tools: 5
};

const resolveCategoryOrder = (category) => {
  const normalized = (category || "").trim().toLowerCase();
  if (!normalized) {
    return 999;
  }

  if (DEFAULT_CATEGORY_ORDER[normalized]) {
    return DEFAULT_CATEGORY_ORDER[normalized];
  }

  // Handle common variants while keeping deterministic ordering.
  if (normalized.includes("front")) return 1;
  if (normalized.includes("back")) return 2;
  if (normalized.includes("data")) return 3;
  if (normalized.includes("ai") || normalized.includes("ml")) return 4;
  if (normalized.includes("tool") || normalized.includes("devops")) return 5;

  return 999;
};

export const migrateSkillCategoryOrder = async () => {
  const skills = await Skill.find();
  if (!skills.length) {
    return;
  }

  const updates = [];
  for (const skill of skills) {
    // Only backfill missing/legacy values; do not override explicitly set custom ordering.
    if (typeof skill.categoryOrder === "number" && skill.categoryOrder !== 999) {
      continue;
    }
    const nextOrder = resolveCategoryOrder(skill.category);
    if (skill.categoryOrder !== nextOrder) {
      updates.push(
        Skill.updateOne(
          { _id: skill._id },
          {
            $set: { categoryOrder: nextOrder }
          }
        )
      );
    }
  }

  if (updates.length) {
    await Promise.all(updates);
  }
};

