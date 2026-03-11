import { Router } from "express";
import { getSiteContent, updateSiteContent } from "../controllers/siteController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", asyncHandler(getSiteContent));
router.put("/", requireAuth, asyncHandler(updateSiteContent));

export default router;
