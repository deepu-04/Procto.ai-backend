import express from "express";
import { getStudentAnalytics, saveAiExamResult } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/analytics-dashboard", getStudentAnalytics);
router.post("/save-ai-result", saveAiExamResult);

export default router;