import { Router } from "express";
import {
  createSkill,
  deleteSkill,
  getSkills,
  updateSkill
} from "../controllers/skillController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", asyncHandler(getSkills));
router.post("/", requireAuth, asyncHandler(createSkill));
router.put("/:id", requireAuth, asyncHandler(updateSkill));
router.delete("/:id", requireAuth, asyncHandler(deleteSkill));

export default router;
