import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserResults,
  getAllResults,
  getResultsByExam,
  toggleVisibility,
} from "../controllers/resultController.js";

const router = express.Router();

router.get("/user", protect, getUserResults);
router.get("/all", protect, getAllResults);
router.get("/exam/:examId", protect, getResultsByExam);
router.put("/:resultId/toggle-visibility", protect, toggleVisibility);

export default router;