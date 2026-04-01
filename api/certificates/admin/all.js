import { methodNotAllowed, withErrorHandling } from "../../../lib/api.js";
import { runController } from "../../../lib/controller.js";
import { getAllCertificates, reorderCertificates } from "../../../server/src/controllers/certificateController.js";

export default withErrorHandling("/api/certificates/admin/all", async (req, res) => {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  return runController({ req, res, controller: getAllCertificates, requiresAuth: true });
});
