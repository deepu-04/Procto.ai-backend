import express from "express";
import {
  createQuestion,
  getQuestionsByExamId,
} from "../controllers/quesController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createQuestion);
router.get("/:examId", protect, getQuestionsByExamId);

export default router;