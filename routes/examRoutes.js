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


router.get("/", protect, getExams);
router.post("/", protect, ipRiskMiddleware, createExam);
router.delete("/:examId", protect, deleteExamById);



router.use("/:examId/cheatingLogs", cheatingLogsRoutes);

export default router;