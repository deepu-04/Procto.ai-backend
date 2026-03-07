import asyncHandler from "express-async-handler";
import Result from "../models/resultModel.js";

/*
SAVE RESULT AFTER EXAM SUBMISSION
*/
const saveResult = asyncHandler(async (req, res) => {
  const { examId, answers, totalMarks, percentage } = req.body;

  if (!examId) {
    res.status(400);
    throw new Error("ExamId required");
  }

  const result = new Result({
    examId,
    userId: req.user._id,
    answers,
    totalMarks,
    percentage,
  });

  const savedResult = await result.save();

  res.status(201).json(savedResult);
});

/*
GET STUDENT RESULTS
*/
const getUserResults = asyncHandler(async (req, res) => {
  const results = await Result.find({
    userId: req.user._id,
    showToStudent: true,
  })
    .populate("examId", "examName")
    .populate("userId", "name email");

  res.status(200).json(results);
});

/*
GET ALL RESULTS (TEACHER)
*/
const getAllResults = asyncHandler(async (req, res) => {
  const results = await Result.find()
    .populate("examId", "examName")
    .populate("userId", "name email");

  res.status(200).json(results);
});

/*
GET RESULTS BY EXAM
*/
const getResultsByExam = asyncHandler(async (req, res) => {
  const results = await Result.find({
    examId: req.params.examId,
  })
    .populate("examId", "examName")
    .populate("userId", "name email");

  res.status(200).json(results);
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

  res.json({ message: "Visibility updated successfully" });
});

export {
  saveResult,
  getUserResults,
  getAllResults,
  getResultsByExam,
  toggleVisibility,
};