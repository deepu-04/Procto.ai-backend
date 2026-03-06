import asyncHandler from "express-async-handler";
import Result from "../models/resultModel.js";


const getUserResults = asyncHandler(async (req, res) => {
  const results = await Result.find({ userId: req.user._id })
    .populate("examId", "examName")
    .populate("userId", "name email");

  res.status(200).json({ data: results });
});


const getAllResults = asyncHandler(async (req, res) => {
  const results = await Result.find()
    .populate("examId", "examName")
    .populate("userId", "name email");

  res.status(200).json({ data: results });
});


const getResultsByExam = asyncHandler(async (req, res) => {
  const results = await Result.find({ examId: req.params.examId })
    .populate("examId", "examName")
    .populate("userId", "name email");

  res.status(200).json({ data: results });
});


const toggleVisibility = asyncHandler(async (req, res) => {
  const result = await Result.findById(req.params.resultId);

  if (!result) {
    res.status(404);
    throw new Error("Result not found");
  }

  result.showToStudent = !result.showToStudent;
  await result.save();

  res.status(200).json({ message: "Visibility updated successfully" });
});

export {
  getUserResults,
  getAllResults,
  getResultsByExam,
  toggleVisibility,
};