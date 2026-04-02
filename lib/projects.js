import { connectDb } from "./db.js";
import { ok } from "./api.js";
import { Project } from "../server/src/models/Project.js";

export const getProjectsResponse = async (req, res) => {
  try {
    await connectDb();
    const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    return ok(res, Array.isArray(projects) ? projects : []);
  } catch (error) {
    console.error("PROJECTS ERROR:", error);
    return ok(res, []);
  }
};
