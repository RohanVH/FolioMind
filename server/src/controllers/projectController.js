import { Project } from "../models/Project.js";
import { generateProjectDescription } from "../services/aiService.js";
import { fetchGithubProjectData } from "../services/githubService.js";

export const getProjects = async (req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  return res.json(projects);
};

const normalizeTechStack = (techStack) => {
  if (Array.isArray(techStack)) {
    return techStack.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof techStack === "string") {
    return techStack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const enrichProjectFromGithub = async (payload) => {
  const nextPayload = { ...payload };
  nextPayload.techStack = normalizeTechStack(nextPayload.techStack);

  if (!nextPayload.githubLink) {
    return nextPayload;
  }

  const githubData = await fetchGithubProjectData(nextPayload.githubLink);
  if (!githubData) {
    return nextPayload;
  }

  nextPayload.title = nextPayload.title || githubData.title;
  nextPayload.githubLink = nextPayload.githubLink || githubData.githubLink;
  nextPayload.liveLink = nextPayload.liveLink || githubData.liveLink;
  nextPayload.image = nextPayload.image || githubData.image;

  const mergedTech = [...nextPayload.techStack, ...githubData.techStack]
    .map((item) => item.trim())
    .filter(Boolean);
  nextPayload.techStack = [...new Set(mergedTech)];

  if (!nextPayload.description || !nextPayload.description.trim()) {
    nextPayload.description = await generateProjectDescription({
      title: nextPayload.title || githubData.title || "Project",
      repoDescription: githubData.repoDescription,
      readmeText: githubData.readmeText,
      techStack: nextPayload.techStack
    });
  }

  return nextPayload;
};

export const createProject = async (req, res) => {
  const payload = await enrichProjectFromGithub(req.body);
  const project = await Project.create(payload);
  return res.status(201).json(project);
};

export const updateProject = async (req, res) => {
  const payload = await enrichProjectFromGithub(req.body);
  const project = await Project.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  });
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  return res.json(project);
};

export const deleteProject = async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  return res.json({ message: "Project deleted" });
};
