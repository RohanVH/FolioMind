import { Project } from "../models/Project.js";
import { SiteContent } from "../models/SiteContent.js";
import { Skill } from "../models/Skill.js";
import { Certificate } from "../models/Certificate.js";
import {
  buildPortfolioPrompt,
  getAiReply,
  getFallbackReply,
  getPortfolioContext,
  detectIntent,
  formatResponse
} from "../services/aiService.js";

export const askAssistant = async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  const [site, skills, projects, certificates] = await Promise.all([
    SiteContent.findOne(),
    Skill.find().sort({ order: 1 }),
    Project.find().sort({ order: 1, createdAt: -1 }),
    Certificate.find({ visible: true }).sort({ order: 1 })
  ]);

  const portfolioData = { site, skills, projects, certificates };
  const dataContext = buildPortfolioPrompt(portfolioData);
  const intent = detectIntent(message);

  const safeHistory = Array.isArray(history)
    ? history
        .filter((item) => item && (item.role === "user" || item.role === "assistant") && item.content)
        .slice(-8)
    : [];

  try {
    const response = await getAiReply({
      message,
      history: safeHistory,
      dataContext,
      portfolioData,
      intent
    });
    const formattedResponse = formatResponse(response, intent);
    return res.json({ message: formattedResponse, source: "openai" });
  } catch (error) {
    const fallback = getFallbackReply({ message, ...portfolioData });
    const formattedResponse = formatResponse(fallback, intent);
    return res.json({ message: formattedResponse, source: "fallback" });
  }
};
