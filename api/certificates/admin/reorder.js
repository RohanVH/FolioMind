import { methodNotAllowed, withErrorHandling } from "../../../lib/api.js";
import { runController } from "../../../lib/controller.js";
import { reorderCertificates } from "../../../server/src/controllers/certificateController.js";

export default withErrorHandling("/api/certificates/admin/reorder", async (req, res) => {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  return runController({ req, res, controller: reorderCertificates, requiresAuth: true, parseBody: true });
});
