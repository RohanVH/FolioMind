import mongoose from "mongoose";
import dns from "node:dns";
import { env } from "./env.js";

let cachedConnectionPromise = null;

export const connectDb = async () => {
  if (!env.mongoUri) {
    throw new Error("MONGO_URI is not configured.");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnectionPromise) {
    return cachedConnectionPromise;
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
    cachedConnectionPromise = null;
    throw error;
  }
};
