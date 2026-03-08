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

// save result manually
router.post("/", protect, saveResult);

// submit exam
router.post("/submit", protect, submitExam);

// student results
router.get("/user", protect, getUserResults);

// admin results
router.get("/all", protect, getAllResults);

// results by exam
router.get("/exam/:examId", protect, getResultsByExam);

// toggle visibility
router.put("/:resultId/toggle-visibility", protect, toggleVisibility);

export default router;