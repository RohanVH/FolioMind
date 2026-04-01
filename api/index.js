import { withErrorHandling } from "../lib/api.js";
import { dispatchRoute } from "../lib/routeHandlers.js";

export const config = {
  api: {
    bodyParser: false
  }
};

export default withErrorHandling("/api/index", async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const queryPath = Array.isArray(req.query?.path) ? req.query.path.join("/") : req.query?.path;
  const pathname =
    (queryPath ? `/api/${String(queryPath).replace(/^\/+/, "")}` : "") ||
    req.headers["x-original-path"] ||
    req.headers["x-matched-path"] ||
    req.headers["x-pathname"] ||
    url.pathname;

  return dispatchRoute({ req, res, pathname });
});
