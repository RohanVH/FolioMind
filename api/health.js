import { json, withErrorHandling } from "../lib/api.js";

export default withErrorHandling("/api/health", async (req, res) => {
  return json(res, 200, { status: "ok", service: "foliomind-vercel-api" });
});
