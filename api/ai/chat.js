import { methodNotAllowed, withErrorHandling } from "../../lib/api.js";
import { runController } from "../../lib/controller.js";
import { askAssistant } from "../../server/src/controllers/aiController.js";

export default withErrorHandling("/api/ai/chat", async (req, res) => {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  return runController({ req, res, controller: askAssistant, parseBody: true });
});
