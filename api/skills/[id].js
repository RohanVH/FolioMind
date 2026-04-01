import { methodNotAllowed, withErrorHandling } from "../../lib/api.js";
import { runController } from "../../lib/controller.js";
import { deleteSkill, updateSkill } from "../../server/src/controllers/skillController.js";

export default withErrorHandling("/api/skills/[id]", async (req, res) => {
  const params = { id: req.query.id };

  if (req.method === "PUT") {
    return runController({ req, res, controller: updateSkill, requiresAuth: true, parseBody: true, params });
  }

  if (req.method === "DELETE") {
    return runController({ req, res, controller: deleteSkill, requiresAuth: true, params });
  }

  return methodNotAllowed(res, ["PUT", "DELETE"]);
});
