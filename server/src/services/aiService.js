import OpenAI from "openai";
import { env } from "../config/env.js";

const openAiCompatibleClient =
  (env.aiApiKey || env.openAiApiKey) && (env.aiProvider === "openai_compatible" || env.aiProvider === "openai")
    ? new OpenAI({
        apiKey: env.aiApiKey || env.openAiApiKey,
        baseURL: env.aiBaseUrl || undefined
      })
    : null;

const systemInstruction =
  "You are the FolioMind AI assistant for a developer portfolio platform. Answer only using the provided portfolio data. If data is unavailable, say so briefly.";

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

export const buildPortfolioPrompt = ({ site, skills, projects }) => {
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
    }))
  };

  return JSON.stringify(payload, null, 2);
};

const summarizeProjects = (projects) => {
  if (!projects.length) {
    return "No projects have been added yet.";
  }
  return projects
    .slice(0, 4)
    .map((project) => `- ${project.title}: ${project.description}`)
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

export const getFallbackReply = ({ message, site, skills, projects }) => {
  const prompt = (message || "").toLowerCase();
  const siteName = "FolioMind";
  const roleText =
    site?.heroSubtitle ||
    site?.heroIntro ||
    "Full stack developer focused on React, Node.js, and AI integrations.";

  if (
    prompt.includes("name of this site") ||
    prompt.includes("site name") ||
    prompt.includes("website name") ||
    prompt.includes("name of the website")
  ) {
    return `This site is called ${siteName}. It is an AI powered developer portfolio platform.`;
  }

  if (prompt.includes("what this website does") || prompt.includes("what does this website do")) {
    return `${siteName} showcases the developer profile, skills, projects, contact details, and includes an AI assistant that answers portfolio questions.`;
  }

  if (prompt.includes("name") || prompt.includes("who is")) {
    return `The developer's name is ${site?.heroTitle || "not configured yet"}.`;
  }

  if (prompt.includes("role") || prompt.includes("position") || prompt.includes("what does he do")) {
    return `His role: ${roleText}`;
  }

  if (prompt.includes("skill") || prompt.includes("stack") || prompt.includes("technology")) {
    return `Here are the listed skills:\n${summarizeSkills(skills)}`;
  }

  if (prompt.includes("project") || prompt.includes("build") || prompt.includes("portfolio")) {
    return `Here are some projects from the portfolio:\n${summarizeProjects(projects)}`;
  }

  if (prompt.includes("contact") || prompt.includes("email") || prompt.includes("github")) {
    return `You can reach out via:\nEmail: ${site?.contactEmail || "Not configured"}\nGitHub: ${site?.github || "Not configured"}`;
  }

  if (prompt.includes("thank")) {
    return "You are welcome. Ask me about projects, skills, role, or contact details.";
  }

  if (prompt.includes("full stack")) {
    return `${site?.heroTitle || "The developer"} is presented as a full stack developer in this portfolio. ${
      site?.heroSubtitle || ""
    }`;
  }

  return `Here is a quick summary:\n${site?.aboutText || "About section is not configured yet."}\n\nTop skills:\n${summarizeSkills(
    skills
  )}\n\nHighlighted projects:\n${summarizeProjects(projects)}`;
};

export const getAiReply = async ({ message, history, dataContext }) => {
  const content = await chatWithProvider({
    temperature: 0.5,
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

  return content || "I could not generate a response.";
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
