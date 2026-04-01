import { methodNotAllowed, withErrorHandling } from "../../lib/api.js";
import { runController } from "../../lib/controller.js";
import { createSkill, getSkills } from "../../server/src/controllers/skillController.js";

export default withErrorHandling("/api/skills", async (req, res) => {
  if (req.method === "GET") {
    return runController({ req, res, controller: getSkills });
  }

  if (req.method === "POST") {
    return runController({ req, res, controller: createSkill, requiresAuth: true, parseBody: true });
  }

  return methodNotAllowed(res, ["GET", "POST"]);
});
