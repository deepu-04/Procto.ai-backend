import express from "express";
import {
  getExams,
  createExam,
  deleteExamById,
} from "../controllers/examController.js";

import { protect } from "../middleware/authMiddleware.js";
import { ipRiskMiddleware } from "../middleware/ipRiskMiddleware.js";
import cheatingLogsRoutes from "./cheatingLogsRoutes.js";

const router = express.Router();

// ================= EXAM ROUTES =================

// Get all exams
router.get("/", protect, getExams);

// Create exam
router.post("/", protect, ipRiskMiddleware, createExam);

// Delete exam
router.delete("/:examId", protect, deleteExamById);

// ================= CHEATING LOG ROUTES =================

router.use("/:examId/cheatingLogs", cheatingLogsRoutes);

export default router;