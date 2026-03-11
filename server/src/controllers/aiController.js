import { Project } from "../models/Project.js";
import { SiteContent } from "../models/SiteContent.js";
import { Skill } from "../models/Skill.js";
import { buildPortfolioPrompt, getAiReply, getFallbackReply } from "../services/aiService.js";

export const askAssistant = async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  const [site, skills, projects] = await Promise.all([
    SiteContent.findOne(),
    Skill.find().sort({ order: 1 }),
    Project.find().sort({ order: 1, createdAt: -1 })
  ]);

  const dataContext = buildPortfolioPrompt({ site, skills, projects });
  const safeHistory = Array.isArray(history)
    ? history
        .filter((item) => item && (item.role === "user" || item.role === "assistant") && item.content)
        .slice(-8)
    : [];

  try {
    const response = await getAiReply({ message, history: safeHistory, dataContext });
    return res.json({ message: response, source: "openai" });
  } catch (error) {
    const fallback = getFallbackReply({ message, site, skills, projects });
    return res.json({ message: fallback, source: "fallback" });
  }
};
