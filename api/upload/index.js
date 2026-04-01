import { methodNotAllowed, withErrorHandling } from "../../lib/api.js";
import { runMultipartController } from "../../lib/controller.js";
import { uploadImage } from "../../server/src/controllers/uploadController.js";

export default withErrorHandling("/api/upload", async (req, res) => {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  return runMultipartController({ req, res, controller: uploadImage, fileFieldName: "image" });
});
