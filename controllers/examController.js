import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import Exam from "../models/examModel.js";
import CheatingLog from "../models/cheatingLogModel.js";

/**
 * @desc    Get all exams
 * @route   GET /api/exams
 * @access  Private
 */
const getExams = asyncHandler(async (req, res) => {
  // Added sorting so the newest exams appear at the top of the list
  const exams = await Exam.find().sort({ createdAt: -1 });
  res.status(200).json(exams);
});

/**
 * @desc    Create a new exam
 * @route   POST /api/exams
 * @access  Private
 */
const createExam = asyncHandler(async (req, res) => {
  const { examName, totalQuestions, duration, liveDate, deadDate } = req.body;

  if (!examName || !duration) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  const exam = new Exam({
    examId: uuidv4(),
    examName,
    totalQuestions,
    duration,
    liveDate,
    deadDate,
  });

  const createdExam = await exam.save();

  // Safety check to ensure req.user exists before logging
  if (req.ipRisk && req.ipRisk.risk >= 40 && req.user) {
    await CheatingLog.create({
      examId: createdExam.examId,
      userId: req.user._id,
      type: "NETWORK",
      reason: req.ipRisk.reasons.join(", "),
      riskScore: req.ipRisk.risk,
      ipAddress: req.ipRisk.ip,
      detectedAt: new Date(),
    });
  }

  // FIX: Returning the raw document so the frontend can access `exam.examId` directly.
  // This ensures the subsequent POST request to /api/coding/question receives the correct ID.
  res.status(201).json(createdExam);
});

/**
 * @desc    Delete exam by ID
 * @route   DELETE /api/exams/:examId
 * @access  Private
 */
const deleteExamById = asyncHandler(async (req, res) => {
  const { examId } = req.params;

  // FIX: Frontend DeleteIcon explicitly passes the MongoDB `_id`.
  // We must use findByIdAndDelete to match the Mongo ObjectId, not the UUID.
  const exam = await Exam.findByIdAndDelete(examId);

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  res.status(200).json({
    success: true,
    message: "Exam deleted successfully",
    deletedExamId: examId,
  });
});

export {
  getExams,
  createExam,
  deleteExamById,
};