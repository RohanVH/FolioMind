import { connectDb } from "./db.js";
import { ok } from "./api.js";
import { SiteContent } from "../server/src/models/SiteContent.js";
import { Project } from "../server/src/models/Project.js";
import { Skill } from "../server/src/models/Skill.js";
import { Certificate } from "../server/src/models/Certificate.js";
import { fetchGithubRepositories } from "../server/src/services/profileAggregatorService.js";
import { fetchHackerRankCertificates } from "../server/src/services/hackerRankService.js";

const defaultData = {
  githubProfile: null,
  githubWarning: "",
  githubRepositories: [],
  hackerRankProfile: "",
  hackerRankCertificates: [],
  hackerRankWarning: "",
  projects: [],
  skills: [],
  certificates: []
};

const mapProjectsToRepositoryCards = (projects = []) =>
  projects
    .filter((project) => String(project?.githubLink || "").trim())
    .sort((a, b) => Number(a?.order ?? 0) - Number(b?.order ?? 0))
    .map((project, index) => ({
      id: `project-${project?._id || project?.id || index}`,
      name: project?.title || "Repository",
      fullName: project?.title || "Repository",
      url: project?.githubLink || "",
      description: project?.description || "",
      language: Array.isArray(project?.techStack) ? project.techStack[0] || "" : "",
      stars: 0,
      updatedAt: project?.updatedAt || ""
    }));

const settledValue = (result, fallback) => (result.status === "fulfilled" ? result.value : fallback);

export const getProfileAggregateResponse = async (req, res) => {
  try {
    await connectDb();

    const [siteResult, projectsResult, skillsResult, certificatesResult] = await Promise.allSettled([
      SiteContent.findOne().lean(),
      Project.find().sort({ order: 1, createdAt: -1 }).lean(),
      Skill.find().sort({ order: 1 }).lean(),
      Certificate.find({ visible: true }).sort({ order: 1, createdAt: -1 }).lean()
    ]);

    const site = settledValue(siteResult, null);
    const projects = Array.isArray(settledValue(projectsResult, [])) ? settledValue(projectsResult, []) : [];
    const skills = Array.isArray(settledValue(skillsResult, [])) ? settledValue(skillsResult, []) : [];
    const certificates = Array.isArray(settledValue(certificatesResult, [])) ? settledValue(certificatesResult, []) : [];
    const profileUrl = site?.hackerrank || "https://www.hackerrank.com/profile/rohanvaradaraju1";

    const [githubResult, hackerRankResult] = await Promise.allSettled([
      fetchGithubRepositories(site?.github || ""),
      fetchHackerRankCertificates(profileUrl)
    ]);

    const github = settledValue(githubResult, { profile: null, repositories: [], warning: "GitHub data unavailable." });
    const hackerRank = settledValue(hackerRankResult, { certificates: [], warning: "HackerRank data unavailable." });

    const githubRepositories = Array.isArray(github?.repositories) && github.repositories.length
      ? github.repositories
      : mapProjectsToRepositoryCards(projects);

    return ok(res, {
      success: true,
      data: {
        ...defaultData,
        githubProfile: github?.profile || null,
        githubWarning: github?.warning || (githubRepositories.length ? "" : "Using project links as fallback source."),
        githubRepositories,
        hackerRankProfile: profileUrl,
        hackerRankCertificates: Array.isArray(hackerRank?.certificates) ? hackerRank.certificates : [],
        hackerRankWarning: hackerRank?.warning || "",
        projects,
        skills,
        certificates
      }
    });
  } catch (error) {
    console.error("ERROR:", error);
    return ok(res, {
      success: false,
      error: error.message || "Failed to aggregate profile data",
      data: defaultData
    });
  }
};
