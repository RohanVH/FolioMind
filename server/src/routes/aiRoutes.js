import { Router } from "express";
import { askAssistant } from "../controllers/aiController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.post("/chat", asyncHandler(askAssistant));

export default router;
