import { Router } from "express";
import { getHackerRankProfile } from "../controllers/hackerRankController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getHackerRankProfile));

export default router;
