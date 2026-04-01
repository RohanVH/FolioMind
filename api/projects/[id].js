import { methodNotAllowed, withErrorHandling } from "../../lib/api.js";
import { runController } from "../../lib/controller.js";
import { deleteProject, updateProject } from "../../server/src/controllers/projectController.js";

export default withErrorHandling("/api/projects/[id]", async (req, res) => {
  const params = { id: req.query.id };

  if (req.method === "PUT") {
    return runController({ req, res, controller: updateProject, requiresAuth: true, parseBody: true, params });
  }

  if (req.method === "DELETE") {
    return runController({ req, res, controller: deleteProject, requiresAuth: true, params });
  }

  return methodNotAllowed(res, ["PUT", "DELETE"]);
});
