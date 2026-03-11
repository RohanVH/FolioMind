import { env } from "../config/env.js";

const cleanText = (value = "") =>
  value
    .replace(/\s+/g, " ")
    .replace(/\u00a0/g, " ")
    .trim();

const extractGithubUsername = (githubUrl = "") => {
  const input = String(githubUrl || "").trim();
  if (!input) {
    return "";
  }

  if (/^[a-zA-Z0-9-]+$/.test(input)) {
    return input;
  }

  try {
    const normalized = input.startsWith("http") ? input : `https://${input}`;
    const url = new URL(normalized);
    if (!url.hostname.includes("github.com")) return "";
    const parts = url.pathname.split("/").filter(Boolean);
    return parts[0] || "";
  } catch {
    return "";
  }
};

const parseGithubReposFromReaderText = (text = "", username = "") => {
  const normalizedUsername = String(username || "").toLowerCase();
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((line) => cleanText(line));

  const repositories = [];
  const seen = new Set();
  const addRepo = (url) => {
    try {
      const parsed = new URL(url);
      if (!parsed.hostname.includes("github.com")) return;
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts.length < 2) return;
      const [owner, repoName] = parts;
      if (!owner || !repoName) return;
      if (normalizedUsername && owner.toLowerCase() !== normalizedUsername) return;
      if (["followers", "following", "stars", "orgs", "organizations", "repositories"].includes(repoName.toLowerCase())) {
        return;
      }
      const fullName = `${owner}/${repoName}`;
      if (seen.has(fullName.toLowerCase())) return;
      seen.add(fullName.toLowerCase());
      repositories.push({
        id: `reader-${fullName.toLowerCase()}`,
        name: repoName,
        fullName,
        url: `https://github.com/${fullName}`,
        description: "",
        language: "",
        stars: 0,
        updatedAt: ""
      });
    } catch {
      // Ignore invalid URLs in fallback content.
    }
  };

  for (const line of lines) {
    const markdownMatches = [...line.matchAll(/\((https?:\/\/github\.com\/[^)\s]+)\)/gi)];
    markdownMatches.forEach((match) => addRepo(match[1]));

    const urlMatches = [...line.matchAll(/https?:\/\/github\.com\/[^\s)]+/gi)];
    urlMatches.forEach((match) => addRepo(match[0]));
  }

  return repositories;
};

const fetchGithubRepositoriesFromReader = async (username) => {
  const response = await fetch(`https://r.jina.ai/http://github.com/${username}?tab=repositories`, {
    headers: {
      "User-Agent": "foliomind-server"
    }
  });

  if (!response.ok) {
    return [];
  }

  const text = await response.text();
  return parseGithubReposFromReaderText(text, username);
};

export const fetchGithubRepositories = async (githubUrl = "") => {
  const username = extractGithubUsername(githubUrl);
  if (!username) {
    return { profile: null, repositories: [], warning: "GitHub username is not configured." };
  }

  const headers = {
    "User-Agent": "foliomind-server",
    Accept: "application/vnd.github+json"
  };
  if (env.githubToken) {
    headers.Authorization = `Bearer ${env.githubToken}`;
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers })
    ]);

    const profile = userRes.ok ? await userRes.json() : null;
    const repositoriesRaw = reposRes.ok ? await reposRes.json() : [];
    const repositories = Array.isArray(repositoriesRaw)
      ? repositoriesRaw
          .filter((repo) => !repo.fork)
          .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
          .map((repo) => ({
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            url: repo.html_url,
            description: repo.description || "",
            language: repo.language || "",
            stars: repo.stargazers_count || 0,
            updatedAt: repo.updated_at
          }))
      : [];

    let warning = "";
    if (!userRes.ok || !reposRes.ok) {
      warning = `GitHub API unavailable (user:${userRes.status}, repos:${reposRes.status}).`;
    }

    let repositoriesFinal = repositories;
    if (!repositoriesFinal.length) {
      const readerRepos = await fetchGithubRepositoriesFromReader(username).catch(() => []);
      if (readerRepos.length) {
        repositoriesFinal = readerRepos;
        warning = warning ? `${warning} Using public profile fallback.` : "Using public profile fallback.";
      }
    }

    return {
      profile: profile
        ? {
            username: profile.login,
            name: profile.name || "",
            bio: profile.bio || "",
            followers: profile.followers || 0,
            publicRepos: profile.public_repos || repositories.length,
            avatarUrl: profile.avatar_url || "",
            url: profile.html_url || githubUrl
          }
        : null,
      repositories: repositoriesFinal,
      warning
    };
  } catch {
    const readerRepos = await fetchGithubRepositoriesFromReader(username).catch(() => []);
    return {
      profile: null,
      repositories: readerRepos,
      warning: readerRepos.length
        ? "GitHub API unavailable. Using public profile fallback."
        : "GitHub repositories could not be fetched due to a network error."
    };
  }
};
