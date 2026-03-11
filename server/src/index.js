import app from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { User } from "./models/User.js";
import { ensureDefaultDocuments } from "./utils/ensureDefaults.js";
import { migrateSkillCategoryOrder } from "./utils/migrateSkillCategoryOrder.js";
import bcrypt from "bcryptjs";

const bootstrap = async () => {
  await connectDb();
  await ensureDefaultDocuments();
  await migrateSkillCategoryOrder();

  const existingAdmin = await User.findOne({ email: env.adminEmail.toLowerCase() });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(env.adminPassword, 10);
    await User.create({
      email: env.adminEmail.toLowerCase(),
      password: hashedPassword,
      role: "admin"
    });
    // eslint-disable-next-line no-console
    console.log(`Default admin created: ${env.adminEmail}`);
  }

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${env.port}`);
  });
};

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
