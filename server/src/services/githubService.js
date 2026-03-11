const parseRepoPath = (githubLink = "") => {
  try {
    const url = new URL(githubLink);
    if (!url.hostname.includes("github.com")) {
      return null;
    }
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) {
      return null;
    }
    return { owner: parts[0], repo: parts[1].replace(".git", "") };
  } catch {
    return null;
  }
};

const decodeBase64 = (value = "") => {
  try {
    return Buffer.from(value, "base64").toString("utf8");
  } catch {
    return "";
  }
};

export const fetchGithubProjectData = async (githubLink) => {
  const parsed = parseRepoPath(githubLink);
  if (!parsed) {
    return null;
  }

  const { owner, repo } = parsed;
  const headers = {
    "User-Agent": "foliomind-server",
    Accept: "application/vnd.github+json"
  };

  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (!repoRes.ok) {
    return null;
  }
  const repoData = await repoRes.json();

  let readmeText = "";
  try {
    const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
    if (readmeRes.ok) {
      const readmePayload = await readmeRes.json();
      readmeText = decodeBase64(readmePayload.content || "").slice(0, 5000);
    }
  } catch {
    readmeText = "";
  }

  return {
    title: repoData.name || repo,
    githubLink: repoData.html_url || githubLink,
    liveLink: repoData.homepage || "",
    image: `https://opengraph.githubassets.com/1/${owner}/${repo}`,
    techStack: [repoData.language, ...(repoData.topics || [])].filter(Boolean),
    repoDescription: repoData.description || "",
    readmeText
  };
};

