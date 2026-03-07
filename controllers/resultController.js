import asyncHandler from "express-async-handler";
import Result from "../models/resultModel.js";

// @desc    Get results for logged in user (Student)
// @route   GET /api/results/user
// @access  Private
const getUserResults = asyncHandler(async (req, res) => {
  // Safety check: Ensure the user is actually authenticated
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("Not authorized, user ID not found");
  }

  // Fetch results for the specific student.
  // Note: We sort by `createdAt: -1` so their most recent exam shows up at the top!
  const results = await Result.find({ userId: req.user._id })
    .populate("examId", "examName totalQuestions duration")
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({ data: results });
});

// @desc    Get all results (Teacher/Admin)
// @route   GET /api/results/all
// @access  Private/Teacher
const getAllResults = asyncHandler(async (req, res) => {
  const results = await Result.find()
    .populate("examId", "examName totalQuestions")
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({ data: results });
});

// @desc    Get results for a specific exam
// @route   GET /api/results/exam/:examId
// @access  Private/Teacher
const getResultsByExam = asyncHandler(async (req, res) => {
  const { examId } = req.params;

  if (!examId) {
    res.status(400);
    throw new Error("Exam ID is required");
  }

  // Sort by percentage descending so the highest scores are at the top
  const results = await Result.find({ examId })
    .populate("examId", "examName")
    .populate("userId", "name email")
    .sort({ percentage: -1 });

  res.status(200).json({ data: results });
});

// @desc    Toggle visibility of a result for the student
// @route   PUT /api/results/:resultId/toggle-visibility
// @access  Private/Teacher
const toggleVisibility = asyncHandler(async (req, res) => {
  const { resultId } = req.params;

  const result = await Result.findById(resultId);

  if (!result) {
    res.status(404);
    throw new Error("Result not found");
  }

  // Flip the boolean
  result.showToStudent = !result.showToStudent;
  await result.save();

  res.status(200).json({ 
    message: `Visibility updated. Student can ${result.showToStudent ? 'now' : 'no longer'} see this result.`,
    data: result 
  });
});

export {
  getUserResults,
  getAllResults,
  getResultsByExam,
  toggleVisibility,
};