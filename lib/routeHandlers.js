import { json, methodNotAllowed } from "./api.js";
import { runController, runMultipartController } from "./controller.js";
import { getCertificatesResponse } from "./certificates.js";
import { getHackerRankResponse } from "./hackerrank.js";
import { getProjectsResponse } from "./projects.js";
import { getSiteResponse } from "./site.js";
import { getSkillsResponse } from "./skills.js";
import { getThemeResponse } from "./theme.js";

const loadExport = async (modulePath, exportName) => {
  const mod = await import(modulePath);
  const value = mod?.[exportName];
  if (!value) {
    throw new Error(`Missing export ${exportName} from ${modulePath}`);
  }
  return value;
};

const routes = [
  {
    pattern: /^\/api\/health$/,
    methods: ["GET"],
    execute: async ({ res }) => res.status(200).json({ status: "ok", service: "foliomind-vercel-api" })
  },
  {
    pattern: /^\/api\/auth\/login$/,
    methods: ["POST"],
    execute: async ({ req, res }) => {
      const login = await loadExport("../server/src/controllers/authController.js", "login");
      return runController({ req, res, controller: login, parseBody: true });
    }
  },
  {
    pattern: /^\/api\/auth\/me$/,
    methods: ["GET"],
    execute: async ({ req, res }) => {
      const me = await loadExport("../server/src/controllers/authController.js", "me");
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
        return runController({ req, res, controller: updateProject, requiresAuth: true, parseBody: true, params });
      }
      const deleteProject = await loadExport("../server/src/controllers/projectController.js", "deleteProject");
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
        return runController({ req, res, controller: updateSkill, requiresAuth: true, parseBody: true, params });
      }
      const deleteSkill = await loadExport("../server/src/controllers/skillController.js", "deleteSkill");
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
      return runController({ req, res, controller: updateTheme, requiresAuth: true, parseBody: true });
    }
  },
  {
    pattern: /^\/api\/profile\/aggregate$/,
    methods: ["GET"],
    execute: async ({ req, res }) => {
      const getProfileAggregate = await loadExport("../server/src/controllers/profileController.js", "getProfileAggregate");
      return runController({ req, res, controller: getProfileAggregate });
    }
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
      return runController({ req, res, controller: createCertificate, requiresAuth: true, parseBody: true });
    }
  },
  {
    pattern: /^\/api\/certificates\/admin\/all$/,
    methods: ["GET"],
    execute: async ({ req, res }) => {
      const getAllCertificates = await loadExport("../server/src/controllers/certificateController.js", "getAllCertificates");
      return runController({ req, res, controller: getAllCertificates, requiresAuth: true });
    }
  },
  {
    pattern: /^\/api\/certificates\/admin\/reorder$/,
    methods: ["POST"],
    execute: async ({ req, res }) => {
      const reorderCertificates = await loadExport("../server/src/controllers/certificateController.js", "reorderCertificates");
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
        return runController({ req, res, controller: updateCertificate, requiresAuth: true, parseBody: true, params });
      }
      const deleteCertificate = await loadExport("../server/src/controllers/certificateController.js", "deleteCertificate");
      return runController({ req, res, controller: deleteCertificate, requiresAuth: true, params });
    }
  },
  {
    pattern: /^\/api\/upload$/,
    methods: ["POST"],
    execute: async ({ req, res }) => {
      const uploadImage = await loadExport("../server/src/controllers/uploadController.js", "uploadImage");
      return runMultipartController({ req, res, controller: uploadImage, fileFieldName: "image" });
    }
  },
  {
    pattern: /^\/api\/upload\/resume$/,
    methods: ["POST", "DELETE"],
    execute: async ({ req, res }) => {
      if (req.method === "POST") {
        const uploadResume = await loadExport("../server/src/controllers/uploadController.js", "uploadResume");
        return runMultipartController({ req, res, controller: uploadResume, fileFieldName: "resume" });
      }
      const deleteResumeFile = await loadExport("../server/src/controllers/uploadController.js", "deleteResumeFile");
      return runController({ req, res, controller: deleteResumeFile, requiresAuth: true, parseBody: true });
    }
  },
  {
    pattern: /^\/api\/ai\/chat$/,
    methods: ["POST"],
    execute: async ({ req, res }) => {
      const askAssistant = await loadExport("../server/src/controllers/aiController.js", "askAssistant");
      return runController({ req, res, controller: askAssistant, parseBody: true });
    }
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
    return json(res, 404, { error: `Route not found: ${pathname}` });
  }

  const { route, match } = resolved;
  if (!route.methods.includes(req.method)) {
    return methodNotAllowed(res, route.methods);
  }

  return route.execute({ req, res, match });
};
