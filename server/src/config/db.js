import mongoose from "mongoose";
import dns from "node:dns";
import { env } from "./env.js";

let cachedConnectionPromise = null;

export const connectDb = async () => {
  if (!env.mongoUri) {
    console.error("DB URI missing");
    return null;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnectionPromise) {
    try {
      return await cachedConnectionPromise;
    } catch {
      cachedConnectionPromise = null;
    }
  }

  const dnsServers = env.mongoDnsServers
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (dnsServers.length > 0) {
    dns.setServers(dnsServers);
  }

  cachedConnectionPromise = mongoose.connect(env.mongoUri);

  try {
    await cachedConnectionPromise;
    return mongoose.connection;
  } catch (error) {
    console.error("DB connection failed:", error.message);
    cachedConnectionPromise = null;
    return null;
  }
};
