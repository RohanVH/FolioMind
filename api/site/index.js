import { methodNotAllowed, withErrorHandling } from "../../lib/api.js";
import { runController } from "../../lib/controller.js";
import { getSiteContent, updateSiteContent } from "../../server/src/controllers/siteController.js";

export default withErrorHandling("/api/site", async (req, res) => {
  if (req.method === "GET") {
    return runController({ req, res, controller: getSiteContent });
  }

  if (req.method === "PUT") {
    return runController({ req, res, controller: updateSiteContent, requiresAuth: true, parseBody: true });
  }

  return methodNotAllowed(res, ["GET", "PUT"]);
});
