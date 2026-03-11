import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject
} from "../controllers/projectController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", asyncHandler(getProjects));
router.post("/", requireAuth, asyncHandler(createProject));
router.put("/:id", requireAuth, asyncHandler(updateProject));
router.delete("/:id", requireAuth, asyncHandler(deleteProject));

export default router;
