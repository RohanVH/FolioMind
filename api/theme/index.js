import { methodNotAllowed, withErrorHandling } from "../../lib/api.js";
import { runController } from "../../lib/controller.js";
import { getTheme, updateTheme } from "../../server/src/controllers/themeController.js";

export default withErrorHandling("/api/theme", async (req, res) => {
  if (req.method === "GET") {
    return runController({ req, res, controller: getTheme });
  }

  if (req.method === "PUT") {
    return runController({ req, res, controller: updateTheme, requiresAuth: true, parseBody: true });
  }

  return methodNotAllowed(res, ["GET", "PUT"]);
});
