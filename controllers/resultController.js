import asyncHandler from "express-async-handler";
import Result from "../models/resultModel.js";

/*
SAVE RESULT
*/
const saveResult = asyncHandler(async (req, res) => {
  const { examId, answers, totalMarks, percentage } = req.body;

  if (!examId) {
    res.status(400);
    throw new Error("ExamId required");
  }

  const result = await Result.create({
    examId,
    userId: req.user._id,
    answers,
    totalMarks,
    percentage,
  });

  res.status(201).json(result);
});

/*
GET USER RESULTS
*/
const getUserResults = asyncHandler(async (req, res) => {
  const results = await Result.find({
    userId: req.user._id,
    showToStudent: true,
  })
    .populate("userId", "name email")
    .populate("examId");

  res.json(results);
});

/*
GET ALL RESULTS (TEACHER)
*/
const getAllResults = asyncHandler(async (req, res) => {
  const results = await Result.find()
    .populate("userId", "name email")
    .populate("examId");

  res.json(results);
});

/*
GET RESULTS BY EXAM
*/
const getResultsByExam = asyncHandler(async (req, res) => {
  const results = await Result.find({
    examId: req.params.examId,
  })
    .populate("userId", "name email")
    .populate("examId");

  res.json(results);
});

/*
TOGGLE VISIBILITY
*/
const toggleVisibility = asyncHandler(async (req, res) => {
  const result = await Result.findById(req.params.resultId);

  if (!result) {
    res.status(404);
    throw new Error("Result not found");
  }

  result.showToStudent = !result.showToStudent;

  await result.save();

  res.json({
    message: "Visibility updated successfully",
    showToStudent: result.showToStudent,
  });
});

export {
  saveResult,
  getUserResults,
  getAllResults,
  getResultsByExam,
  toggleVisibility,
};