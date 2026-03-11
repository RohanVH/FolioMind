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

const extractCertificatesFromReaderText = (text = "") => {
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
    results.push(cleaned);
  }

  return uniqueNonEmpty(results);
};

const fetchFromRestApis = async (username = "") => {
  if (!username) return [];

  const endpoints = [
    `https://www.hackerrank.com/rest/hackers/${encodeURIComponent(username)}/certificates`,
    `https://www.hackerrank.com/rest/hackers/${encodeURIComponent(username)}/badges`
  ];

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
      const names = model
        .map((item) => item?.name || item?.title || item?.certificate_name || item?.badge_name || "")
        .filter(Boolean);
      const normalized = uniqueNonEmpty(names);
      if (normalized.length) {
        return normalized;
      }
    } catch {
      // ignore endpoint errors and continue trying
    }
  }

  return [];
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
  return extractCertificatesFromReaderText(text);
};

export const fetchHackerRankCertificates = async (profileUrl = "") => {
  if (!profileUrl) {
    return { certificates: [], warning: "HackerRank profile URL is not configured." };
  }

  const username = extractUsername(profileUrl);
  const fromRest = await fetchFromRestApis(username);
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
