import { connectDb } from "./db.js";
import { ok } from "./api.js";
import { env } from "./env.js";
import { Project } from "../server/src/models/Project.js";
import { SiteContent } from "../server/src/models/SiteContent.js";
import { Skill } from "../server/src/models/Skill.js";
import { Certificate } from "../server/src/models/Certificate.js";
import {
  buildPortfolioPrompt,
  detectIntent,
  formatResponse,
  getAiReply,
  getFallbackReply
} from "../server/src/services/aiService.js";

const safeArray = (value) => (Array.isArray(value) ? value : []);

export const askAssistantResponse = async (req, res) => {
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const message = String(body?.message || "").trim();
    const history = safeArray(body?.history);

    if (!message) {
      return ok(res, {
        success: false,
        error: "Message is required"
      });
    }

    await connectDb();

    const [siteResult, skillsResult, projectsResult, certificatesResult] = await Promise.allSettled([
      SiteContent.findOne().lean(),
      Skill.find().sort({ order: 1 }).lean(),
      Project.find().sort({ order: 1, createdAt: -1 }).lean(),
      Certificate.find({ visible: true }).sort({ order: 1 }).lean()
    ]);

    const site = siteResult.status === "fulfilled" ? siteResult.value : null;
    const skills = skillsResult.status === "fulfilled" ? safeArray(skillsResult.value) : [];
    const projects = projectsResult.status === "fulfilled" ? safeArray(projectsResult.value) : [];
    const certificates = certificatesResult.status === "fulfilled" ? safeArray(certificatesResult.value) : [];

    const portfolioData = { site, skills, projects, certificates };
    const dataContext = buildPortfolioPrompt(portfolioData);
    const intent = detectIntent(message);
    const safeHistory = history
      .filter((item) => item && (item.role === "user" || item.role === "assistant") && item.content)
      .slice(-8);

    if (!process.env.OPENAI_API_KEY && env.aiProvider !== "ollama" && !process.env.AI_API_KEY) {
      const fallback = getFallbackReply({ message, ...portfolioData });
      return ok(res, {
        success: false,
        error: "Missing API key",
        data: {
          message: formatResponse(fallback, intent),
          source: "fallback"
        }
      });
    }

    try {
      const response = await getAiReply({
        message,
        history: safeHistory,
        dataContext,
        portfolioData,
        intent
      });

      return ok(res, {
        success: true,
        data: {
          message: formatResponse(response, intent),
          source: env.aiProvider === "ollama" ? "ollama" : "openai"
        }
      });
    } catch (error) {
      console.error("External API failed:", error.message);
      const fallback = getFallbackReply({ message, ...portfolioData });
      return ok(res, {
        success: false,
        error: error.message || "AI request failed",
        data: {
          message: formatResponse(fallback, intent),
          source: "fallback"
        }
      });
    }
  } catch (error) {
    console.error("ERROR:", error);
    return ok(res, {
      success: false,
      error: error.message || "AI route failed",
      data: {
        message: "I don't have that information.",
        source: "fallback"
      }
    });
  }
};
