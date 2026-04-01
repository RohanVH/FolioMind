import { methodNotAllowed, withErrorHandling } from "../../lib/api.js";
import { runController } from "../../lib/controller.js";
import { deleteCertificate, updateCertificate } from "../../server/src/controllers/certificateController.js";

export default withErrorHandling("/api/certificates/[id]", async (req, res) => {
  const params = { id: req.query.id };

  if (req.method === "PUT") {
    return runController({ req, res, controller: updateCertificate, requiresAuth: true, parseBody: true, params });
  }

  if (req.method === "DELETE") {
    return runController({ req, res, controller: deleteCertificate, requiresAuth: true, params });
  }

  return methodNotAllowed(res, ["PUT", "DELETE"]);
});
