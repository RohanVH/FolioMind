import { connectDb } from "./db.js";
import { ok } from "./api.js";
import { Certificate } from "../server/src/models/Certificate.js";

export const getCertificatesResponse = async (req, res) => {
  try {
    await connectDb();
    const certificates = await Certificate.find({ visible: true }).sort({ order: 1, createdAt: -1 }).lean();
    return ok(res, Array.isArray(certificates) ? certificates : []);
  } catch (error) {
    console.error("CERTIFICATES ERROR:", error);
    return ok(res, []);
  }
};
