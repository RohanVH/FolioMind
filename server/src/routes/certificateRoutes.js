import { Router } from "express";
import {
  getCertificates,
  getAllCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  reorderCertificates
} from "../controllers/certificateController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public routes
router.get("/", asyncHandler(getCertificates));

// Protected routes (admin only)
router.get("/admin/all", requireAuth, asyncHandler(getAllCertificates));
router.post("/", requireAuth, asyncHandler(createCertificate));
router.put("/:id", requireAuth, asyncHandler(updateCertificate));
router.delete("/:id", requireAuth, asyncHandler(deleteCertificate));
router.post("/admin/reorder", requireAuth, asyncHandler(reorderCertificates));

export default router;
