import { methodNotAllowed, withErrorHandling } from "../../lib/api.js";
import { runController } from "../../lib/controller.js";
import { getProfileAggregate } from "../../server/src/controllers/profileController.js";

export default withErrorHandling("/api/profile/aggregate", async (req, res) => {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  return runController({ req, res, controller: getProfileAggregate });
});
