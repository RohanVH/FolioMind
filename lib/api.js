export const json = (res, statusCode, payload) => res.status(statusCode).json(payload);

export const methodNotAllowed = (res, allowedMethods) =>
  json(res, 405, {
    message: `Method not allowed. Use ${allowedMethods.join(", ")}.`
  });

export const parseJsonBody = async (req) => {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return req.body;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
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
    return json(res, error.statusCode || 500, {
      message: error.message || "Internal server error"
    });
  }
};
