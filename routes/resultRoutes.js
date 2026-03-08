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

router.post("/", protect, saveResult);

router.get("/user", protect, getUserResults);

router.get("/all", protect, getAllResults);

router.get("/exam/:examId", protect, getResultsByExam);

router.put("/:resultId/toggle-visibility", protect, toggleVisibility);

router.post("/submit", protect, submitExam);

export default router;