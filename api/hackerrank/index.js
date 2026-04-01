import { methodNotAllowed, withErrorHandling } from "../../lib/api.js";
import { runController } from "../../lib/controller.js";
import { getHackerRankProfile } from "../../server/src/controllers/hackerRankController.js";

export default withErrorHandling("/api/hackerrank", async (req, res) => {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  return runController({ req, res, controller: getHackerRankProfile });
});
