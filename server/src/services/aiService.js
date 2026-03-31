import OpenAI from "openai";
import { env } from "../config/env.js";

const openAiCompatibleClient =
  (env.aiApiKey || env.openAiApiKey) && (env.aiProvider === "openai_compatible" || env.aiProvider === "openai")
    ? new OpenAI({
        apiKey: env.aiApiKey || env.openAiApiKey,
        baseURL: env.aiBaseUrl || undefined
      })
    : null;

// --- CACHING MECHANISM ---
let portfolioCache = null;
let cacheTimestamp = null;
const CACHE_DURATION_MS = 5000; // 5 seconds cache

const isCacheValid = () => {
  return portfolioCache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION_MS;
};

export const getPortfolioContext = (portfolioData) => {
  if (isCacheValid()) {
    return portfolioCache;
  }

  portfolioCache = buildPortfolioPrompt(portfolioData);
  cacheTimestamp = Date.now();
  return portfolioCache;
};

// --- STRICT SYSTEM PROMPT (NO HALLUCINATIONS) ---
const systemInstruction = `You are a portfolio assistant. CRITICAL RULES:

1. Answer ONLY using data provided in context.
2. If information not in data, respond: "I don't have that information."
3. Never guess, assume, or hallucinate about the person.
4. Keep answers SHORT and DIRECT.
5. No extra sentences, no creative additions.
6. No emojis or decorative text.
7. If asked about something outside portfolio, refuse clearly.

Style: minimal, factual, data-driven.`;

// --- INTENT DETECTION ---
export const detectIntent = (message) => {
  const lower = (message || "").toLowerCase();

  if (/^how many|^count|^total|^how many certificates|^how many projects|^how many skills/.test(lower)) {
    return "count";
  }

  if (/^list|^show me|^what are|^what.*have|^enumerate|^list all/.test(lower)) {
    return "list";
  }

  if (/^\?|help|what can you|what should/.test(lower)) {
    return "help";
  }

  return "general";
};

// --- RESPONSE FORMATTING ---
export const formatResponse = (response, intent) => {
  if (!response) return "I could not generate a response.";

  let trimmed = response.trim();

  // Remove markdown formatting
  trimmed = trimmed.replace(/\*\*/g, "").replace(/\*/g, "").replace(/`/g, "");

  // For count intent, extract just the number
  if (intent === "count") {
    const match = trimmed.match(/\d+/);
    if (match) {
      return match[0];
    }
  }

  // For list intent, clean up formatting
  if (intent === "list") {
    trimmed = trimmed
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line)
      .slice(0, 10)
      .join("\n");
  }

  // Limit to 2-3 lines for general responses to avoid verbosity
  if (intent === "general") {
    const lines = trimmed.split("\n").filter((line) => line.trim());
    if (lines.length > 3) {
      trimmed = lines.slice(0, 3).join("\n");
    }
  }

  return trimmed;
};

const chatWithProvider = async ({ messages, temperature = 0.4 }) => {
  if (env.aiProvider === "ollama") {
    const response = await fetch(`${env.ollamaBaseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: env.ollamaModel,
        stream: false,
        options: {
          temperature
        },
        messages
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Ollama request failed: ${text}`);
    }

    const payload = await response.json();
    return payload?.message?.content || "";
  }

  if (!openAiCompatibleClient) {
    throw new Error("No AI provider is configured. Set AI_PROVIDER and credentials.");
  }

  const completion = await openAiCompatibleClient.chat.completions.create({
    model: env.aiModel || env.openAiModel,
    temperature,
    messages
  });

  return completion.choices[0]?.message?.content || "";
};

export const buildPortfolioPrompt = ({ site, skills, projects, certificates = [] }) => {
  const payload = {
    about: {
      heroTitle: site?.heroTitle || "",
      heroSubtitle: site?.heroSubtitle || "",
      heroIntro: site?.heroIntro || "",
      aboutText: site?.aboutText || ""
    },
    contacts: {
      email: site?.contactEmail || "",
      github: site?.github || ""
    },
    skills: skills.map((skill) => ({
      name: skill.name,
      category: skill.category
    })),
    projects: projects.map((project) => ({
      title: project.title,
      description: project.description,
      techStack: project.techStack,
      featured: project.featured,
      githubLink: project.githubLink,
      liveLink: project.liveLink
    })),
    certificates: certificates.map((cert) => ({
      title: cert.title,
      skill: cert.skill,
      date: cert.date,
      certificate_link: cert.certificate_link
    }))
  };

  return JSON.stringify(payload, null, 2);
};

const summarizeProjects = (projects) => {
  if (!projects.length) {
    return "No projects have been added yet.";
  }
  return projects
    .slice(0, 5)
    .map((project) => `- ${project.title}: ${project.description}`)
    .join("\n");
};

const summarizeCertificates = (certificates) => {
  if (!certificates.length) {
    return "No certificates available.";
  }
  return certificates
    .slice(0, 5)
    .map((cert) => `- ${cert.title} (${cert.skill})`)
    .join("\n");
};

const getCategoryRank = (category = "") => {
  const normalized = category.trim().toLowerCase();
  if (normalized === "frontend" || normalized.includes("front")) return 1;
  if (normalized === "backend" || normalized.includes("back")) return 2;
  if (normalized === "database" || normalized.includes("data")) return 3;
  if (normalized === "ai" || normalized.includes("ai") || normalized.includes("ml")) return 4;
  if (normalized === "tools" || normalized.includes("tool")) return 5;
  return 999;
};

const summarizeSkills = (skills) => {
  if (!skills.length) {
    return "No skills have been added yet.";
  }
  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = { order: skill.categoryOrder ?? 999, names: [] };
    }
    acc[skill.category].order = Math.min(acc[skill.category].order, skill.categoryOrder ?? 999);
    acc[skill.category].names.push(skill.name);
    return acc;
  }, {});

  return Object.entries(grouped)
    .sort((a, b) => getCategoryRank(a[0]) - getCategoryRank(b[0]) || a[0].localeCompare(b[0]))
    .map(([category, item]) => `${category}: ${item.names.join(", ")}`)
    .join("\n");
};

export const getFallbackReply = ({ message, site, skills, projects, certificates = [] }) => {
  const prompt = (message || "").toLowerCase();

  // Intent-based responses
  if (/^how many|^count/.test(prompt)) {
    if (prompt.includes("certificate")) {
      return String(certificates.length);
    }
    if (prompt.includes("project")) {
      return String(projects.length);
    }
    if (prompt.includes("skill")) {
      return String(skills.length);
    }
  }

  if (/^list|^show me|^what.*have/.test(prompt)) {
    if (prompt.includes("certificate")) {
      return summarizeCertificates(certificates);
    }
    if (prompt.includes("project")) {
      return projects.map((p) => p.title).join("\n");
    }
    if (prompt.includes("skill")) {
      return skills.map((s) => s.name).join("\n");
    }
  }

  if (
    prompt.includes("name of this site") ||
    prompt.includes("site name") ||
    prompt.includes("website name") ||
    prompt.includes("name of the website")
  ) {
    return "This site is called FolioMind. It is an AI powered developer portfolio platform.";
  }

  if (prompt.includes("what this website does") || prompt.includes("what does this website do")) {
    return "FolioMind showcases the developer profile, skills, projects, certificates, contact details, and has an AI assistant for visitor questions.";
  }

  if (prompt.includes("name") || prompt.includes("who is")) {
    return `The developer's name is ${site?.heroTitle || "not configured yet"}.`;
  }

  if (prompt.includes("role") || prompt.includes("position") || prompt.includes("what does he do")) {
    const roleText = site?.heroSubtitle || site?.heroIntro || "Full stack developer focused on React, Node.js, and AI integrations.";
    return `His role: ${roleText}`;
  }

  if (prompt.includes("skill") || prompt.includes("stack") || prompt.includes("technology")) {
    if (!skills.length) return "No skills have been configured yet.";
    return skills.slice(0, 8).map((s) => s.name).join(", ");
  }

  if (prompt.includes("project") || prompt.includes("build")) {
    if (!projects.length) return "No projects have been configured yet.";
    return projects.slice(0, 3).map((p) => p.title).join(", ");
  }

  if (prompt.includes("certificate")) {
    if (!certificates.length) return "No certificates available.";
    return summarizeCertificates(certificates);
  }

  if (prompt.includes("contact") || prompt.includes("email") || prompt.includes("github")) {
    return `Email: ${site?.contactEmail || "Not configured"}\nGitHub: ${site?.github || "Not configured"}`;
  }

  if (prompt.includes("thank")) {
    return "You are welcome. Ask me about projects, skills, certificates, or role.";
  }

  if (prompt.includes("full stack")) {
    return "Yes. This portfolio presents the developer as a full stack engineer.";
  }

  // Default: return "I don't have that information."
  return "I don't have that information.";
};

export const getAiReply = async ({ message, history, dataContext, portfolioData, intent }) => {
  const content = await chatWithProvider({
    temperature: 0.3, // Lower temperature for more deterministic responses
    messages: [
      {
        role: "system",
        content: systemInstruction
      },
      {
        role: "system",
        content: `Portfolio data:\n${dataContext}`
      },
      ...history,
      {
        role: "user",
        content: message
      }
    ]
  });

  return content || "I don't have that information.";
};

export const generateProjectDescription = async ({
  title,
  repoDescription,
  readmeText,
  techStack = []
}) => {
  const fallback =
    repoDescription ||
    `${title} is a software project built with ${techStack.slice(0, 4).join(", ") || "modern technologies"}.`;

  try {
    const content = await chatWithProvider({
      temperature: 0.6,
      messages: [
        {
          role: "system",
          content:
            "You write concise portfolio project descriptions. Return 2-3 sentences, clear and professional."
        },
        {
          role: "user",
          content: `Project title: ${title}\nRepo description: ${repoDescription || "N/A"}\nTech stack: ${techStack.join(
            ", "
          )}\nREADME excerpt:\n${(readmeText || "").slice(0, 2000)}`
        }
      ]
    });

    return (content || fallback).trim();
  } catch {
    return fallback;
  }
};
