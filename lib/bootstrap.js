import bcrypt from "bcryptjs";
import { connectDb } from "./db.js";
import { env } from "./env.js";
import { User } from "../server/src/models/User.js";
import { ensureDefaultDocuments } from "../server/src/utils/ensureDefaults.js";
import { migrateSkillCategoryOrder } from "../server/src/utils/migrateSkillCategoryOrder.js";

const globalBootstrap = globalThis.__foliomindBootstrap ?? {
  promise: null
};

globalThis.__foliomindBootstrap = globalBootstrap;

export const bootstrapApp = async () => {
  if (!globalBootstrap.promise) {
    globalBootstrap.promise = (async () => {
      await connectDb();
      await ensureDefaultDocuments();
      await migrateSkillCategoryOrder();

      const normalizedEmail = env.adminEmail.toLowerCase();
      const existingAdmin = await User.findOne({ email: normalizedEmail });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(env.adminPassword, 10);
        await User.create({
          email: normalizedEmail,
          password: hashedPassword,
          role: "admin"
        });
      }
    })();
  }

  try {
    return await globalBootstrap.promise;
  } catch (error) {
    globalBootstrap.promise = null;
    throw error;
  }
};
