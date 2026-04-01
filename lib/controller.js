import { bootstrapApp } from "./bootstrap.js";
import { requireAuth } from "./auth.js";
import { parseJsonBody } from "./api.js";
import { parseMultipartForm } from "./multipart.js";

export const runController = async ({ req, res, controller, requiresAuth = false, parseBody = false, params = {} }) => {
  await bootstrapApp();
  req.params = params;

  if (parseBody) {
    req.body = await parseJsonBody(req);
  }

  if (requiresAuth) {
    requireAuth(req);
  }

  return controller(req, res);
};

export const runMultipartController = async ({ req, res, controller, fileFieldName, params = {} }) => {
  await bootstrapApp();
  req.params = params;
  requireAuth(req);

  const { fields, file } = await parseMultipartForm(req, fileFieldName);
  req.body = fields;
  req.file = file;

  return controller(req, res);
};
