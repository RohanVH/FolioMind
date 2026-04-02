import dns from "node:dns";
import mongoose from "mongoose";

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null, dnsConfigured: false };
}

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || "";

  if (!mongoUri) {
    console.error("DB URI missing");
    return null;
  }

  if (cached.conn || mongoose.connection.readyState === 1) {
    cached.conn = mongoose.connection;
    return cached.conn;
  }

  if (!cached.dnsConfigured) {
    const dnsServers = String(process.env.MONGO_DNS_SERVERS || "8.8.8.8,1.1.1.1")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (dnsServers.length) {
      dns.setServers(dnsServers);
    }

    cached.dnsConfigured = true;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri, {
      bufferCommands: false
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("DB connection failed:", error.message);
    cached.promise = null;
    cached.conn = null;
    return null;
  }
}

export const connectDb = connectDB;
