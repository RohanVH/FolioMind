import { methodNotAllowed, withErrorHandling } from "../../lib/api.js";
import { runController } from "../../lib/controller.js";
import { createProject, getProjects } from "../../server/src/controllers/projectController.js";

export default withErrorHandling("/api/projects", async (req, res) => {
  if (req.method === "GET") {
    return runController({ req, res, controller: getProjects });
  }

  if (req.method === "POST") {
    return runController({ req, res, controller: createProject, requiresAuth: true, parseBody: true });
  }

  return methodNotAllowed(res, ["GET", "POST"]);
});
