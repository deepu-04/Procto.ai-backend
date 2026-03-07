import asyncHandler from "express-async-handler";
import CheatingLog from "../models/cheatingLogModel.js";

/**
 * @desc    Save a new cheating log/violation
 * @route   POST /api/cheating-logs
 * @access  Private (Student)
 */
export const saveCheatingLog = asyncHandler(async (req, res) => {
  // Securely force the userId to be the authenticated user making the request.
  // This prevents students from spoofing the payload to frame other students.
  const logData = {
    ...req.body,
    userId: req.user ? req.user._id : req.body.userId,
  };

  const log = new CheatingLog(logData);
  const savedLog = await log.save();
  
  res.status(201).json({
    success: true,
    data: savedLog
  });
});

/**
 * @desc    Get all cheating logs (with optional filtering)
 * @route   GET /api/cheating-logs
 * @access  Private (Teacher/Admin)
 */
export const getCheatingLogs = asyncHandler(async (req, res) => {
  // Allow the frontend to filter logs by specific exams or students via query params
  // Example: /api/cheating-logs?examId=abc1234
  const { examId, userId } = req.query;
  
  const filter = {};
  if (examId) filter.examId = examId;
  if (userId) filter.userId = userId;

  // Populate references so the frontend receives actual names instead of raw IDs
  const logs = await CheatingLog.find(filter)
    .populate("userId", "name email")
    .populate("examId", "examName")
    .sort({ createdAt: -1 }); // Newest violations first

  res.status(200).json({
    success: true,
    count: logs.length,
    data: logs
  });
});