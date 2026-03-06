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
  const exams = await Exam.find();
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

  if (req.ipRisk && req.ipRisk.risk >= 40) {
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

  res.status(201).json({
    success: true,
    exam: createdExam,
  });
});

/**
 * @desc    Delete exam by examId (UUID)
 * @route   DELETE /api/exams/:examId
 * @access  Private
 */
const deleteExamById = asyncHandler(async (req, res) => {
  const { examId } = req.params;

  const exam = await Exam.findOneAndDelete({ examId });

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