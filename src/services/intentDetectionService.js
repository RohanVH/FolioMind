/**
 * Intent Detection & Logic-First Handler
 * Handles common queries without AI, falls back to AI for unknown intents
 */

// --- INTENT DETECTION ---

const INTENTIONS = {
  COUNT_CERTIFICATES: "count_certificates",
  LIST_CERTIFICATES: "list_certificates",
  CHECK_CERTIFICATE: "check_certificate",
  CONTACT_INFO: "contact_info",
  NAME_INFO: "name_info",
  SKILLS_INFO: "skills_info",
  PROJECTS_INFO: "projects_info",
  UNKNOWN: "unknown"
};

/**
 * Normalize user input: lowercase, trim, remove extra punctuation
 */
export const normalizeInput = (input) => {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/[?!.,;:]+$/g, ""); // Remove ending punctuation
};

/**
 * Detect user intent from keyword analysis
 */
export const detectIntent = (message) => {
  const normalized = normalizeInput(message);

  // COUNT_CERTIFICATES: "how many certificates", "count certificates", "total certificates"
  if (/how many.*certificate|count.*certificate|total.*certificate/.test(normalized)) {
    return INTENTIONS.COUNT_CERTIFICATES;
  }

  // LIST_CERTIFICATES: "list certificates", "show certificates", "what certificates"
  if (/^list.*certificate|^show.*certificate|^what.*certificate/.test(normalized)) {
    return INTENTIONS.LIST_CERTIFICATES;
  }

  // CHECK_CERTIFICATE: "sql certificate", "python certificate", "do you have X certificate"
  if (/certificate|certified/.test(normalized) && !/^(list|show|how many|what certificate)/.test(normalized)) {
    return INTENTIONS.CHECK_CERTIFICATE;
  }

  // CONTACT_INFO: "contact", "email", "phone", "github", "reach out"
  if (/contact|email|phone|github|reach out|get in touch/.test(normalized)) {
    return INTENTIONS.CONTACT_INFO;
  }

  // NAME_INFO: "name", "who are you", "what's your name"
  if (/^name$|^who are you|^what.?s your name|^who is/.test(normalized)) {
    return INTENTIONS.NAME_INFO;
  }

  // SKILLS_INFO: "skills", "tech stack", "technologies", "languages"
  if (/^skill|^tech stack|^technolog|^language|^what stack|^what.*do you use/.test(normalized)) {
    return INTENTIONS.SKILLS_INFO;
  }

  // PROJECTS_INFO: "projects", "portfolio", "built", "work"
  if (/^project|^portfolio|^what.*built|^what.*work/.test(normalized)) {
    return INTENTIONS.PROJECTS_INFO;
  }

  return INTENTIONS.UNKNOWN;
};

// --- LOGIC HANDLERS (NO AI NEEDED) ---

/**
 * Handle count_certificates intent
 */
export const handleCountCertificates = (certificates) => {
  if (!Array.isArray(certificates)) return "0";
  return String(certificates.length);
};

/**
 * Handle list_certificates intent
 */
export const handleListCertificates = (certificates) => {
  if (!Array.isArray(certificates) || certificates.length === 0) {
    return "No certificates available.";
  }

  // Return only titles, one per line
  return certificates
    .slice(0, 10) // Limit to 10 for brevity
    .map((cert) => `• ${cert.title}`)
    .join("\n");
};

/**
 * Handle check_certificate intent
 * Search for a specific certificate in the list
 */
export const handleCheckCertificate = (message, certificates) => {
  if (!Array.isArray(certificates) || certificates.length === 0) {
    return "No certificates available.";
  }

  const normalized = normalizeInput(message);

  // Extract certificate name (word before/after "certificate")
  const match = normalized.match(/(\w+)\s*certificate/);
  if (!match) return "I don't have that information.";

  const searchTerm = match[1].toLowerCase();

  // Search in certificates
  const found = certificates.some(
    (cert) =>
      cert.title.toLowerCase().includes(searchTerm) ||
      cert.skill.toLowerCase().includes(searchTerm)
  );

  return found ? "Yes" : "No";
};

/**
 * Handle contact_info intent
 */
export const handleContactInfo = (site) => {
  if (!site) return "Contact information not available.";

  const email = site.contactEmail || "Not provided";
  const github = site.github || "Not provided";

  return `Email: ${email} | GitHub: ${github}`;
};

/**
 * Handle name_info intent
 */
export const handleNameInfo = (site) => {
  if (!site) return "Name not available.";

  // Return clean name (remove "Hi, I'm" or similar)
  const name = site.heroTitle || site.name || "Not configured";
  return name.replace(/^Hi, I'?m\s*/, "").trim();
};

/**
 * Handle skills_info intent
 */
export const handleSkillsInfo = (skills) => {
  if (!Array.isArray(skills) || skills.length === 0) {
    return "No skills available.";
  }

  // Return top 10 skills as comma-separated list
  return skills
    .slice(0, 10)
    .map((skill) => skill.name)
    .join(", ");
};

/**
 * Handle projects_info intent
 */
export const handleProjectsInfo = (projects) => {
  if (!Array.isArray(projects) || projects.length === 0) {
    return "No projects available.";
  }

  // Return featured projects first, then others
  const featured = projects.filter((p) => p.featured).slice(0, 5);
  const others = projects.filter((p) => !p.featured).slice(0, 5);
  const toShow = [...featured, ...others].slice(0, 8);

  return toShow
    .map((proj) => `• ${proj.title}`)
    .join("\n");
};

// --- LOGIC-FIRST HANDLER ---

/**
 * Process user query using logic first, no AI needed
 * Returns response and whether to fall back to AI
 */
export const handleLogicFirst = (message, { site, skills, projects, certificates }) => {
  const intent = detectIntent(message);

  switch (intent) {
    case INTENTIONS.COUNT_CERTIFICATES:
      return {
        response: handleCountCertificates(certificates),
        fallbackToAI: false
      };

    case INTENTIONS.LIST_CERTIFICATES:
      return {
        response: handleListCertificates(certificates),
        fallbackToAI: false
      };

    case INTENTIONS.CHECK_CERTIFICATE:
      return {
        response: handleCheckCertificate(message, certificates),
        fallbackToAI: false
      };

    case INTENTIONS.CONTACT_INFO:
      return {
        response: handleContactInfo(site),
        fallbackToAI: false
      };

    case INTENTIONS.NAME_INFO:
      return {
        response: handleNameInfo(site),
        fallbackToAI: false
      };

    case INTENTIONS.SKILLS_INFO:
      return {
        response: handleSkillsInfo(skills),
        fallbackToAI: false
      };

    case INTENTIONS.PROJECTS_INFO:
      return {
        response: handleProjectsInfo(projects),
        fallbackToAI: false
      };

    default:
      // Unknown intent - use AI
      return {
        response: null,
        fallbackToAI: true
      };
  }
};

// --- RESPONSE FORMATTER ---

/**
 * Clean up response text - no extra fluff
 */
export const formatResponse = (response) => {
  if (!response) return "I don't have that information.";

  return response
    .trim()
    .split("\n")
    .filter((line) => line.trim())
    .join("\n");
};

// --- EXPORTS ---

export const IntentDetectionService = {
  normalizeInput,
  detectIntent,
  handleCountCertificates,
  handleListCertificates,
  handleCheckCertificate,
  handleContactInfo,
  handleNameInfo,
  handleSkillsInfo,
  handleProjectsInfo,
  handleLogicFirst,
  formatResponse,
  INTENTIONS
};
