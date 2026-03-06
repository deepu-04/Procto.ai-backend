import express from "express";
import {
  submitCodingAnswer,
  createCodingQuestion,
  getCodingQuestions,
  getCodingQuestion,
  getCodingQuestionsByExamId,
} from "../controllers/codingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.use(protect);


router.post("/submit", submitCodingAnswer);
router.get("/questions/exam/:examId", getCodingQuestionsByExamId);


router.post("/question", createCodingQuestion);
router.get("/questions", getCodingQuestions);
router.get("/questions/:id", getCodingQuestion);

export default router;
