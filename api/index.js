import { withErrorHandling } from "../lib/api.js";
import { dispatchRoute } from "../lib/routeHandlers.js";

export const config = {
  api: {
    bodyParser: false
  }
};

export default withErrorHandling("/api/index", async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  return dispatchRoute({ req, res, pathname: url.pathname });
});
