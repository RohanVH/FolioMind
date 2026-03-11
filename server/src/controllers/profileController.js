import { SiteContent } from "../models/SiteContent.js";
import { Project } from "../models/Project.js";
import { fetchGithubRepositories } from "../services/profileAggregatorService.js";
import { fetchHackerRankCertificates } from "../services/hackerRankService.js";

const mapProjectsToRepositoryCards = (projects = []) =>
  projects
    .filter((project) => String(project.githubLink || "").trim())
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((project) => ({
      id: `project-${project._id}`,
      name: project.title || "Repository",
      fullName: project.title || "Repository",
      url: project.githubLink,
      description: project.description || "",
      language: (project.techStack || [])[0] || "",
      stars: 0,
      updatedAt: project.updatedAt
    }));

export const getProfileAggregate = async (req, res) => {
  const [site, projects] = await Promise.all([SiteContent.findOne(), Project.find()]);

  const [github, hackerRank] = await Promise.all([
    fetchGithubRepositories(site?.github || ""),
    fetchHackerRankCertificates(site?.hackerrank || "https://www.hackerrank.com/profile/rohanvaradaraju1")
  ]);

  const githubRepositories = github.repositories.length
    ? github.repositories
    : mapProjectsToRepositoryCards(projects);
  const githubWarning = github.warning || (github.repositories.length ? "" : "Using project links as fallback source.");

  return res.json({
    githubProfile: github.profile,
    githubWarning,
    githubRepositories,
    hackerRankProfile: site?.hackerrank || "https://www.hackerrank.com/profile/rohanvaradaraju1",
    hackerRankCertificates: hackerRank.certificates || [],
    hackerRankWarning: hackerRank.warning || ""
  });
};
