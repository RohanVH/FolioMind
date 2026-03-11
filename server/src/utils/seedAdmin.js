import bcrypt from "bcryptjs";
import { connectDb } from "../config/db.js";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

const seed = async () => {
  await connectDb();

  const hashedPassword = await bcrypt.hash(env.adminPassword, 10);
  await User.findOneAndUpdate(
    { email: env.adminEmail.toLowerCase() },
    {
      email: env.adminEmail.toLowerCase(),
      password: hashedPassword,
      role: "admin"
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // eslint-disable-next-line no-console
  console.log(`Admin seeded for ${env.adminEmail}`);
  process.exit(0);
};

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});

