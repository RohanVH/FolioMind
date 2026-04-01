import { methodNotAllowed, withErrorHandling } from "../../lib/api.js";
import { runController } from "../../lib/controller.js";
import { me } from "../../server/src/controllers/authController.js";

export default withErrorHandling("/api/auth/me", async (req, res) => {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  return runController({ req, res, controller: me, requiresAuth: true });
});
