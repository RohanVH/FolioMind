import { json, methodNotAllowed } from "./api.js";
import { runController, runMultipartController } from "./controller.js";
import { login, me } from "../server/src/controllers/authController.js";
import {
  createCertificate,
  deleteCertificate,
  getAllCertificates,
  getCertificates,
  reorderCertificates,
  updateCertificate
} from "../server/src/controllers/certificateController.js";
import { getHackerRankProfile } from "../server/src/controllers/hackerRankController.js";
import { getProfileAggregate } from "../server/src/controllers/profileController.js";
import { createProject, deleteProject, getProjects, updateProject } from "../server/src/controllers/projectController.js";
import { getSiteContent, updateSiteContent } from "../server/src/controllers/siteController.js";
import { createSkill, deleteSkill, getSkills, updateSkill } from "../server/src/controllers/skillController.js";
import { getTheme, updateTheme } from "../server/src/controllers/themeController.js";
import { deleteResumeFile, uploadImage, uploadResume } from "../server/src/controllers/uploadController.js";
import { askAssistant } from "../server/src/controllers/aiController.js";

const routes = [
  {
    pattern: /^\/api\/health$/,
    methods: ["GET"],
    routeName: "/api/health",
    execute: async ({ res }) => json(res, 200, { status: "ok", service: "foliomind-vercel-api" })
  },
  {
    pattern: /^\/api\/auth\/login$/,
    methods: ["POST"],
    routeName: "/api/auth/login",
    execute: async ({ req, res }) => runController({ req, res, controller: login, parseBody: true })
  },
  {
    pattern: /^\/api\/auth\/me$/,
    methods: ["GET"],
    routeName: "/api/auth/me",
    execute: async ({ req, res }) => runController({ req, res, controller: me, requiresAuth: true })
  },
  {
    pattern: /^\/api\/projects$/,
    methods: ["GET", "POST"],
    routeName: "/api/projects",
    execute: async ({ req, res }) =>
      req.method === "GET"
        ? runController({ req, res, controller: getProjects })
        : runController({ req, res, controller: createProject, requiresAuth: true, parseBody: true })
  },
  {
    pattern: /^\/api\/projects\/([^/]+)$/,
    methods: ["PUT", "DELETE"],
    routeName: "/api/projects/[id]",
    execute: async ({ req, res, match }) => {
      const params = { id: match[1] };
      return req.method === "PUT"
        ? runController({ req, res, controller: updateProject, requiresAuth: true, parseBody: true, params })
        : runController({ req, res, controller: deleteProject, requiresAuth: true, params });
    }
  },
  {
    pattern: /^\/api\/skills$/,
    methods: ["GET", "POST"],
    routeName: "/api/skills",
    execute: async ({ req, res }) =>
      req.method === "GET"
        ? runController({ req, res, controller: getSkills })
        : runController({ req, res, controller: createSkill, requiresAuth: true, parseBody: true })
  },
  {
    pattern: /^\/api\/skills\/([^/]+)$/,
    methods: ["PUT", "DELETE"],
    routeName: "/api/skills/[id]",
    execute: async ({ req, res, match }) => {
      const params = { id: match[1] };
      return req.method === "PUT"
        ? runController({ req, res, controller: updateSkill, requiresAuth: true, parseBody: true, params })
        : runController({ req, res, controller: deleteSkill, requiresAuth: true, params });
    }
  },
  {
    pattern: /^\/api\/site$/,
    methods: ["GET", "PUT"],
    routeName: "/api/site",
    execute: async ({ req, res }) =>
      req.method === "GET"
        ? runController({ req, res, controller: getSiteContent })
        : runController({ req, res, controller: updateSiteContent, requiresAuth: true, parseBody: true })
  },
  {
    pattern: /^\/api\/theme$/,
    methods: ["GET", "PUT"],
    routeName: "/api/theme",
    execute: async ({ req, res }) =>
      req.method === "GET"
        ? runController({ req, res, controller: getTheme })
        : runController({ req, res, controller: updateTheme, requiresAuth: true, parseBody: true })
  },
  {
    pattern: /^\/api\/profile\/aggregate$/,
    methods: ["GET"],
    routeName: "/api/profile/aggregate",
    execute: async ({ req, res }) => runController({ req, res, controller: getProfileAggregate })
  },
  {
    pattern: /^\/api\/hackerrank$/,
    methods: ["GET"],
    routeName: "/api/hackerrank",
    execute: async ({ req, res }) => runController({ req, res, controller: getHackerRankProfile })
  },
  {
    pattern: /^\/api\/certificates$/,
    methods: ["GET", "POST"],
    routeName: "/api/certificates",
    execute: async ({ req, res }) =>
      req.method === "GET"
        ? runController({ req, res, controller: getCertificates })
        : runController({ req, res, controller: createCertificate, requiresAuth: true, parseBody: true })
  },
  {
    pattern: /^\/api\/certificates\/admin\/all$/,
    methods: ["GET"],
    routeName: "/api/certificates/admin/all",
    execute: async ({ req, res }) => runController({ req, res, controller: getAllCertificates, requiresAuth: true })
  },
  {
    pattern: /^\/api\/certificates\/admin\/reorder$/,
    methods: ["POST"],
    routeName: "/api/certificates/admin/reorder",
    execute: async ({ req, res }) =>
      runController({ req, res, controller: reorderCertificates, requiresAuth: true, parseBody: true })
  },
  {
    pattern: /^\/api\/certificates\/([^/]+)$/,
    methods: ["PUT", "DELETE"],
    routeName: "/api/certificates/[id]",
    execute: async ({ req, res, match }) => {
      const params = { id: match[1] };
      return req.method === "PUT"
        ? runController({ req, res, controller: updateCertificate, requiresAuth: true, parseBody: true, params })
        : runController({ req, res, controller: deleteCertificate, requiresAuth: true, params });
    }
  },
  {
    pattern: /^\/api\/upload$/,
    methods: ["POST"],
    routeName: "/api/upload",
    execute: async ({ req, res }) => runMultipartController({ req, res, controller: uploadImage, fileFieldName: "image" })
  },
  {
    pattern: /^\/api\/upload\/resume$/,
    methods: ["POST", "DELETE"],
    routeName: "/api/upload/resume",
    execute: async ({ req, res }) =>
      req.method === "POST"
        ? runMultipartController({ req, res, controller: uploadResume, fileFieldName: "resume" })
        : runController({ req, res, controller: deleteResumeFile, requiresAuth: true, parseBody: true })
  },
  {
    pattern: /^\/api\/ai\/chat$/,
    methods: ["POST"],
    routeName: "/api/ai/chat",
    execute: async ({ req, res }) => runController({ req, res, controller: askAssistant, parseBody: true })
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
    return json(res, 404, { message: `Route not found: ${pathname}` });
  }

  const { route, match } = resolved;
  if (!route.methods.includes(req.method)) {
    return methodNotAllowed(res, route.methods);
  }

  return route.execute({ req, res, match });
};
