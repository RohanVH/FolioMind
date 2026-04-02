export const json = (res, statusCode, payload) => res.status(statusCode).json(payload);

export const methodNotAllowed = (res, allowedMethods) =>
  json(res, 405, {
    message: `Method not allowed. Use ${allowedMethods.join(", ")}.`
  });

export const ok = (res, payload) => json(res, 200, payload);

export const parseJsonBody = async (req) => {
  if (typeof req.body === "string") {
    const rawString = req.body.trim();
    if (!rawString) {
      return {};
    }

    try {
      return JSON.parse(rawString);
    } catch {
      const error = new Error("Invalid JSON payload");
      error.statusCode = 400;
      throw error;
    }
  }

  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return req.body;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    const error = new Error("Invalid JSON payload");
    error.statusCode = 400;
    throw error;
  }
};

export const withErrorHandling = (routeName, handler) => async (req, res) => {
  console.log(`API HIT ${routeName}`);

  try {
    return await handler(req, res);
  } catch (error) {
    console.error("ERROR:", error);
    return json(res, error.statusCode || 500, {
      error: error.message || "Internal server error",
      route: routeName
    });
  }
};
