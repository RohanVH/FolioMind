import { json, methodNotAllowed } from "./api.js";
import { runController, runMultipartController } from "./controller.js";
import { askAssistantResponse } from "./aiChat.js";
import { getCertificatesResponse } from "./certificates.js";
import { getHackerRankResponse } from "./hackerrank.js";
import { getProfileAggregateResponse } from "./profileAggregate.js";
import { getProjectsResponse } from "./projects.js";
import { getSiteResponse } from "./site.js";
import { getSkillsResponse } from "./skills.js";
import { getThemeResponse } from "./theme.js";

const loadExport = async (modulePath, exportName) => {
  try {
    const mod = await import(modulePath);
    return mod?.[exportName] || null;
  } catch (error) {
    console.error("ERROR:", error);
    return null;
  }
};

const routes = [
  {
    pattern: /^\/api\/health$/,
    methods: ["GET"],
    execute: async ({ res }) => res.status(200).json({ success: true, data: { status: "ok", service: "foliomind-vercel-api" } })
  },
  {
    pattern: /^\/api\/auth\/login$/,
    methods: ["POST"],
    execute: async ({ req, res }) => {
      const login = await loadExport("../server/src/controllers/authController.js", "login");
      if (!login) {
        return res.status(200).json({ success: false, error: "Login handler unavailable" });
      }
      return runController({ req, res, controller: login, parseBody: true });
    }
  },
  {
    pattern: /^\/api\/auth\/me$/,
    methods: ["GET"],
    execute: async ({ req, res }) => {
      const me = await loadExport("../server/src/controllers/authController.js", "me");
      if (!me) {
        return res.status(200).json({ success: false, error: "Auth handler unavailable" });
      }
      return runController({ req, res, controller: me, requiresAuth: true });
    }
  },
  {
    pattern: /^\/api\/projects$/,
    methods: ["GET", "POST"],
    execute: async ({ req, res }) => {
      if (req.method === "GET") {
        return getProjectsResponse(req, res);
      }
      const createProject = await loadExport("../server/src/controllers/projectController.js", "createProject");
      if (!createProject) {
        return res.status(200).json({ success: false, error: "Project handler unavailable" });
      }
      return runController({ req, res, controller: createProject, requiresAuth: true, parseBody: true });
    }
  },
  {
    pattern: /^\/api\/projects\/([^/]+)$/,
    methods: ["PUT", "DELETE"],
    execute: async ({ req, res, match }) => {
      const params = { id: match[1] };
      if (req.method === "PUT") {
        const updateProject = await loadExport("../server/src/controllers/projectController.js", "updateProject");
        if (!updateProject) {
          return res.status(200).json({ success: false, error: "Project handler unavailable" });
        }
        return runController({ req, res, controller: updateProject, requiresAuth: true, parseBody: true, params });
      }
      const deleteProject = await loadExport("../server/src/controllers/projectController.js", "deleteProject");
      if (!deleteProject) {
        return res.status(200).json({ success: false, error: "Project handler unavailable" });
      }
      return runController({ req, res, controller: deleteProject, requiresAuth: true, params });
    }
  },
  {
    pattern: /^\/api\/skills$/,
    methods: ["GET", "POST"],
    execute: async ({ req, res }) => {
      if (req.method === "GET") {
        return getSkillsResponse(req, res);
      }
      const createSkill = await loadExport("../server/src/controllers/skillController.js", "createSkill");
      if (!createSkill) {
        return res.status(200).json({ success: false, error: "Skill handler unavailable" });
      }
      return runController({ req, res, controller: createSkill, requiresAuth: true, parseBody: true });
    }
  },
  {
    pattern: /^\/api\/skills\/([^/]+)$/,
    methods: ["PUT", "DELETE"],
    execute: async ({ req, res, match }) => {
      const params = { id: match[1] };
      if (req.method === "PUT") {
        const updateSkill = await loadExport("../server/src/controllers/skillController.js", "updateSkill");
        if (!updateSkill) {
          return res.status(200).json({ success: false, error: "Skill handler unavailable" });
        }
        return runController({ req, res, controller: updateSkill, requiresAuth: true, parseBody: true, params });
      }
      const deleteSkill = await loadExport("../server/src/controllers/skillController.js", "deleteSkill");
      if (!deleteSkill) {
        return res.status(200).json({ success: false, error: "Skill handler unavailable" });
      }
      return runController({ req, res, controller: deleteSkill, requiresAuth: true, params });
    }
  },
  {
    pattern: /^\/api\/site$/,
    methods: ["GET", "PUT"],
    execute: async ({ req, res }) => {
      if (req.method === "GET") {
        return getSiteResponse(req, res);
      }
      const updateSiteContent = await loadExport("../server/src/controllers/siteController.js", "updateSiteContent");
      if (!updateSiteContent) {
        return res.status(200).json({ success: false, error: "Site handler unavailable" });
      }
      return runController({ req, res, controller: updateSiteContent, requiresAuth: true, parseBody: true });
    }
  },
  {
    pattern: /^\/api\/theme$/,
    methods: ["GET", "PUT"],
    execute: async ({ req, res }) => {
      if (req.method === "GET") {
        return getThemeResponse(req, res);
      }
      const updateTheme = await loadExport("../server/src/controllers/themeController.js", "updateTheme");
      if (!updateTheme) {
        return res.status(200).json({ success: false, error: "Theme handler unavailable" });
      }
      return runController({ req, res, controller: updateTheme, requiresAuth: true, parseBody: true });
    }
  },
  {
    pattern: /^\/api\/profile\/aggregate$/,
    methods: ["GET"],
    execute: async ({ req, res }) => getProfileAggregateResponse(req, res)
  },
  {
    pattern: /^\/api\/hackerrank$/,
    methods: ["GET"],
    execute: async ({ req, res }) => getHackerRankResponse(req, res)
  },
  {
    pattern: /^\/api\/certificates$/,
    methods: ["GET", "POST"],
    execute: async ({ req, res }) => {
      if (req.method === "GET") {
        return getCertificatesResponse(req, res);
      }
      const createCertificate = await loadExport("../server/src/controllers/certificateController.js", "createCertificate");
      if (!createCertificate) {
        return res.status(200).json({ success: false, error: "Certificate handler unavailable" });
      }
      return runController({ req, res, controller: createCertificate, requiresAuth: true, parseBody: true });
    }
  },
  {
    pattern: /^\/api\/certificates\/admin\/all$/,
    methods: ["GET"],
    execute: async ({ req, res }) => {
      const getAllCertificates = await loadExport("../server/src/controllers/certificateController.js", "getAllCertificates");
      if (!getAllCertificates) {
        return res.status(200).json({ success: false, error: "Certificate handler unavailable" });
      }
      return runController({ req, res, controller: getAllCertificates, requiresAuth: true });
    }
  },
  {
    pattern: /^\/api\/certificates\/admin\/reorder$/,
    methods: ["POST"],
    execute: async ({ req, res }) => {
      const reorderCertificates = await loadExport("../server/src/controllers/certificateController.js", "reorderCertificates");
      if (!reorderCertificates) {
        return res.status(200).json({ success: false, error: "Certificate handler unavailable" });
      }
      return runController({ req, res, controller: reorderCertificates, requiresAuth: true, parseBody: true });
    }
  },
  {
    pattern: /^\/api\/certificates\/([^/]+)$/,
    methods: ["PUT", "DELETE"],
    execute: async ({ req, res, match }) => {
      const params = { id: match[1] };
      if (req.method === "PUT") {
        const updateCertificate = await loadExport("../server/src/controllers/certificateController.js", "updateCertificate");
        if (!updateCertificate) {
          return res.status(200).json({ success: false, error: "Certificate handler unavailable" });
        }
        return runController({ req, res, controller: updateCertificate, requiresAuth: true, parseBody: true, params });
      }
      const deleteCertificate = await loadExport("../server/src/controllers/certificateController.js", "deleteCertificate");
      if (!deleteCertificate) {
        return res.status(200).json({ success: false, error: "Certificate handler unavailable" });
      }
      return runController({ req, res, controller: deleteCertificate, requiresAuth: true, params });
    }
  },
  {
    pattern: /^\/api\/upload$/,
    methods: ["POST"],
    execute: async ({ req, res }) => {
      const uploadImage = await loadExport("../server/src/controllers/uploadController.js", "uploadImage");
      if (!uploadImage) {
        return res.status(200).json({ success: false, error: "Upload handler unavailable" });
      }
      return runMultipartController({ req, res, controller: uploadImage, fileFieldName: "image" });
    }
  },
  {
    pattern: /^\/api\/upload\/resume$/,
    methods: ["POST", "DELETE"],
    execute: async ({ req, res }) => {
      if (req.method === "POST") {
        const uploadResume = await loadExport("../server/src/controllers/uploadController.js", "uploadResume");
        if (!uploadResume) {
          return res.status(200).json({ success: false, error: "Upload handler unavailable" });
        }
        return runMultipartController({ req, res, controller: uploadResume, fileFieldName: "resume" });
      }
      const deleteResumeFile = await loadExport("../server/src/controllers/uploadController.js", "deleteResumeFile");
      if (!deleteResumeFile) {
        return res.status(200).json({ success: false, error: "Upload handler unavailable" });
      }
      return runController({ req, res, controller: deleteResumeFile, requiresAuth: true, parseBody: true });
    }
  },
  {
    pattern: /^\/api\/ai\/chat$/,
    methods: ["POST"],
    execute: async ({ req, res }) => askAssistantResponse(req, res)
  }
];

export const resolveRoute = (pathname) => {
  for (const route of routes) {
    const match = pathname.match(route.pattern);
    if (match) {
      return { route, match };
    }
  }
  return null;
};

export const dispatchRoute = async ({ req, res, pathname }) => {
  const resolved = resolveRoute(pathname);

  if (!resolved) {
    return json(res, 200, { success: false, error: `Route not found: ${pathname}` });
  }

  const { route, match } = resolved;
  if (!route.methods.includes(req.method)) {
    return methodNotAllowed(res, route.methods);
  }

  try {
    return await route.execute({ req, res, match });
  } catch (error) {
    console.error("ERROR:", error);
    return res.status(200).json({ success: false, error: error.message || "Route execution failed" });
  }
};
