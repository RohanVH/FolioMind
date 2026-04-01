import { methodNotAllowed, withErrorHandling } from "../../../lib/api.js";
import { runController, runMultipartController } from "../../../lib/controller.js";
import { deleteResumeFile, uploadResume } from "../../../server/src/controllers/uploadController.js";

export default withErrorHandling("/api/upload/resume", async (req, res) => {
  if (req.method === "POST") {
    return runMultipartController({ req, res, controller: uploadResume, fileFieldName: "resume" });
  }

  if (req.method === "DELETE") {
    return runController({ req, res, controller: deleteResumeFile, requiresAuth: true, parseBody: true });
  }

  return methodNotAllowed(res, ["POST", "DELETE"]);
});
