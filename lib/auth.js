import jwt from "jsonwebtoken";
import { env } from "./env.js";

export const requireAuth = (req) => {
  const authHeader = req.headers.authorization || req.headers.Authorization || "";

  if (!String(authHeader).startsWith("Bearer ")) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  try {
    const payload = jwt.verify(String(authHeader).slice(7), env.jwtSecret);
    req.user = payload;
    return payload;
  } catch {
    const error = new Error("Invalid or expired token");
    error.statusCode = 401;
    throw error;
  }
};
