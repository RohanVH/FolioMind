import { Router } from "express";
import multer from "multer";
import { deleteResumeFile, uploadImage, uploadResume } from "../controllers/uploadController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post("/", requireAuth, upload.single("image"), asyncHandler(uploadImage));
router.post("/resume", requireAuth, upload.single("resume"), asyncHandler(uploadResume));
router.delete("/resume", requireAuth, asyncHandler(deleteResumeFile));

export default router;
