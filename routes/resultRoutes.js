import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getUserResults,
  getAllResults,
  getResultsByExam,
  toggleVisibility,
  saveResult
} from "../controllers/resultController.js";

import { submitExam } from "../controllers/submitExamController.js";

const router = express.Router();

// Save result manually
router.post("/", protect, saveResult);

// Student results
router.get("/user", protect, getUserResults);

// Admin results
router.get("/all", protect, getAllResults);

// Results by exam
router.get("/exam/:examId", protect, getResultsByExam);

// Toggle result visibility
router.put("/:resultId/toggle-visibility", protect, toggleVisibility);

// Submit exam
router.post("/submit", protect, submitExam);

export default router;