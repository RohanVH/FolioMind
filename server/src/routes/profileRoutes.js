import { Router } from "express";
import { getProfileAggregate } from "../controllers/profileController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/aggregate", asyncHandler(getProfileAggregate));

export default router;

