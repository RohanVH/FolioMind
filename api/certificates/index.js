import { methodNotAllowed, withErrorHandling } from "../../lib/api.js";
import { runController } from "../../lib/controller.js";
import {
  createCertificate,
  getCertificates
} from "../../server/src/controllers/certificateController.js";

export default withErrorHandling("/api/certificates", async (req, res) => {
  if (req.method === "GET") {
    return runController({ req, res, controller: getCertificates });
  }

  if (req.method === "POST") {
    return runController({ req, res, controller: createCertificate, requiresAuth: true, parseBody: true });
  }

  return methodNotAllowed(res, ["GET", "POST"]);
});
