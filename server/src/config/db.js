import mongoose from "mongoose";
import dns from "node:dns";
import { env } from "./env.js";

export const connectDb = async () => {
  if (!env.mongoUri) {
    throw new Error("MONGO_URI is not configured.");
  }

  // Some corporate/local resolvers refuse SRV lookups used by mongodb+srv URIs.
  const dnsServers = env.mongoDnsServers
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (dnsServers.length > 0) {
    dns.setServers(dnsServers);
  }

  await mongoose.connect(env.mongoUri);
};
