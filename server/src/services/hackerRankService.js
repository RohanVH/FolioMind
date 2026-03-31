const cleanText = (value = "") =>
  String(value || "")
    .replace(/\s+/g, " ")
    .replace(/\u00a0/g, " ")
    .trim();

const uniqueNonEmpty = (values = []) => [...new Set(values.map((item) => cleanText(item)).filter(Boolean))];

const extractUsername = (profileUrl = "") => {
  const raw = String(profileUrl || "").trim();
  if (!raw) return "";
  try {
    const normalized = raw.startsWith("http") ? raw : `https://${raw}`;
    const url = new URL(normalized);
    const parts = url.pathname.split("/").filter(Boolean);
    if (!parts.length) return "";
    const profileIndex = parts.findIndex((part) => part.toLowerCase() === "profile");
    if (profileIndex >= 0 && parts[profileIndex + 1]) {
      return parts[profileIndex + 1];
    }
    return parts[0];
  } catch {
    return "";
  }
};

const extractCertificatesFromReaderText = (text = "", profileUrl = "") => {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((line) => cleanText(line))
    .filter(Boolean);

  const results = [];
  let inCertificateBlock = false;

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes("certificate") || lower.includes("certification")) {
      inCertificateBlock = true;
      continue;
    }

    if (inCertificateBlock && /^#{1,6}\s+/.test(line)) {
      break;
    }

    if (!inCertificateBlock) {
      continue;
    }

    const cleaned = line.replace(/^[-*•\d.)\s]+/, "").trim();
    if (cleaned.length < 3) continue;
    if (cleaned.length > 120) continue;
    if (/view certificate|verify|credential/i.test(cleaned)) continue;
    
    results.push({
      title: cleaned,
      skill: extractSkillFromTitle(cleaned),
      link: `${profileUrl}#certificates`,
      date: null,
      image: null,
      verified: true
    });
  }

  return uniqueNonEmpty(results.map(r => r.title)).map(title => ({
    title,
    skill: extractSkillFromTitle(title),
    link: `${profileUrl}#certificates`,
    date: null,
    image: null,
    verified: true
  }));
};

const fetchFromRestApis = async (username = "", profileUrl = "") => {
  if (!username) return [];

  const endpoints = [
    `https://www.hackerrank.com/rest/hackers/${encodeURIComponent(username)}/certificates`,
    `https://www.hackerrank.com/rest/hackers/${encodeURIComponent(username)}/badges`
  ];

  const certificates = [];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          "User-Agent": "foliomind-server",
          Accept: "application/json"
        }
      });
      if (!response.ok) {
        continue;
      }
      const payload = await response.json();
      const model = Array.isArray(payload?.models) ? payload.models : Array.isArray(payload) ? payload : [];
      
      model.forEach((item) => {
        const title = item?.name || item?.title || item?.certificate_name || item?.badge_name || "";
        if (title) {
          certificates.push({
            title: cleanText(title),
            skill: extractSkillFromTitle(title),
            link: item?.url || item?.certificate_url || `${profileUrl}#certificates`,
            date: item?.issued_date || item?.date || null,
            image: item?.image_url || item?.badge_image || null,
            verified: item?.verified || true
          });
        }
      });

      if (certificates.length) {
        break;
      }
    } catch {
      // ignore endpoint errors and continue trying
    }
  }

  return certificates;
};

const extractSkillFromTitle = (title = "") => {
  const skillKeywords = {
    problem: "Problem Solving",
    algorithm: "Algorithms",
    data: "Data Structures",
    sql: "SQL",
    python: "Python",
    javascript: "JavaScript",
    java: "Java",
    cpp: "C++",
    c: "C",
    react: "React",
    html: "HTML",
    css: "CSS",
    web: "Web Development",
    machine: "Machine Learning",
    ai: "Artificial Intelligence",
    git: "Git",
    linux: "Linux",
    shell: "Shell",
    rest: "REST API",
    api: "API"
  };

  const lowerTitle = title.toLowerCase();
  for (const [keyword, skill] of Object.entries(skillKeywords)) {
    if (lowerTitle.includes(keyword)) {
      return skill;
    }
  }

  return "General Knowledge";
};

const fetchFromReader = async (profileUrl = "") => {
  if (!profileUrl) return [];
  const response = await fetch(`https://r.jina.ai/http://${profileUrl.replace(/^https?:\/\//i, "")}`, {
    headers: { "User-Agent": "foliomind-server" }
  });
  if (!response.ok) {
    return [];
  }
  const text = await response.text();
  return extractCertificatesFromReaderText(text, profileUrl);
};

export const fetchHackerRankCertificates = async (profileUrl = "") => {
  if (!profileUrl) {
    return { certificates: [], warning: "HackerRank profile URL is not configured." };
  }

  const username = extractUsername(profileUrl);
  const fromRest = await fetchFromRestApis(username, profileUrl);
  if (fromRest.length) {
    return { certificates: fromRest, warning: "" };
  }

  try {
    const fromReader = await fetchFromReader(profileUrl);
    return {
      certificates: fromReader,
      warning: fromReader.length ? "Using public profile fallback." : "No certifications found on public profile."
    };
  } catch {
    return {
      certificates: [],
      warning: "HackerRank certifications could not be fetched due to a network error."
    };
  }
};
