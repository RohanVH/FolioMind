import { Skill } from "../models/Skill.js";

const CATEGORY_RANK = {
  frontend: 1,
  backend: 2,
  database: 3,
  ai: 4,
  tools: 5
};

const getCategoryRank = (category = "") => {
  const normalized = category.trim().toLowerCase();
  if (CATEGORY_RANK[normalized]) return CATEGORY_RANK[normalized];
  if (normalized.includes("front")) return 1;
  if (normalized.includes("back")) return 2;
  if (normalized.includes("data")) return 3;
  if (normalized.includes("ai") || normalized.includes("ml")) return 4;
  if (normalized.includes("tool")) return 5;
  return 999;
};

export const getSkills = async (req, res) => {
  const skills = await Skill.find().lean();
  skills.sort((a, b) => {
    const categoryDiff = getCategoryRank(a.category) - getCategoryRank(b.category);
    if (categoryDiff !== 0) return categoryDiff;
    const categoryNameDiff = (a.category || "").localeCompare(b.category || "");
    if (categoryNameDiff !== 0) return categoryNameDiff;
    const orderDiff = (a.order ?? 0) - (b.order ?? 0);
    if (orderDiff !== 0) return orderDiff;
    return (a.name || "").localeCompare(b.name || "");
  });
  return res.json(skills);
};

export const createSkill = async (req, res) => {
  const skill = await Skill.create(req.body);
  return res.status(201).json(skill);
};

export const updateSkill = async (req, res) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!skill) {
    return res.status(404).json({ message: "Skill not found" });
  }
  return res.json(skill);
};

export const deleteSkill = async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) {
    return res.status(404).json({ message: "Skill not found" });
  }
  return res.json({ message: "Skill deleted" });
};
