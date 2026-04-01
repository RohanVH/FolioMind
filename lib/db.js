import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "./env.js";

const globalDb = globalThis.__foliomindDb ?? {
  conn: null,
  promise: null,
  dnsConfigured: false
};

globalThis.__foliomindDb = globalDb;

export const connectDb = async () => {
  if (!env.mongoUri) {
    throw new Error("MONGO_URI is not configured.");
  }

  if (globalDb.conn || mongoose.connection.readyState === 1) {
    globalDb.conn = mongoose.connection;
    return globalDb.conn;
  }

  if (!globalDb.dnsConfigured) {
    const dnsServers = env.mongoDnsServers
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (dnsServers.length) {
      dns.setServers(dnsServers);
    }

    globalDb.dnsConfigured = true;
  }

  if (!globalDb.promise) {
    globalDb.promise = mongoose.connect(env.mongoUri).then((connection) => connection);
  }

  try {
    globalDb.conn = await globalDb.promise;
    return globalDb.conn;
  } catch (error) {
    globalDb.promise = null;
    throw error;
  }
};
