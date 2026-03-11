import { Router } from "express";
import { getTheme, updateTheme } from "../controllers/themeController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", asyncHandler(getTheme));
router.put("/", requireAuth, asyncHandler(updateTheme));

export default router;
