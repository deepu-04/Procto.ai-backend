import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getUserResults,
  getAllResults,
  getResultsByExam,
  toggleVisibility,
  saveResult
} from "../controllers/resultController.js";

import submitExam from "../controllers/submitExamController.js";

const router = express.Router();

// ================= SAVE RESULT MANUALLY =================
router.post("/", protect, saveResult);

// ================= SUBMIT EXAM =================
router.post("/submit", protect, submitExam);

// ================= STUDENT RESULTS =================
router.get("/user", protect, getUserResults);

// ================= ADMIN RESULTS =================
router.get("/all", protect, getAllResults);

// ================= RESULTS BY EXAM =================
router.get("/exam/:examId", protect, getResultsByExam);

// ================= TOGGLE VISIBILITY =================
router.put("/:resultId/toggle-visibility", protect, toggleVisibility);

export default router;