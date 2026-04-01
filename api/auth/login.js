import { methodNotAllowed, withErrorHandling } from "../../lib/api.js";
import { runController } from "../../lib/controller.js";
import { login } from "../../server/src/controllers/authController.js";

export default withErrorHandling("/api/auth/login", async (req, res) => {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  return runController({ req, res, controller: login, parseBody: true });
});
