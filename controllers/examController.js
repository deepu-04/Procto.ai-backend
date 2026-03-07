import asyncHandler from "express-async-handler";
import Exam from "../models/examModel.js";

// ================= GET ALL EXAMS =================
// GET /api/exams
const getExams = asyncHandler(async (req, res) => {
  const exams = await Exam.find().sort({ createdAt: -1 });
  res.status(200).json(exams);
});

// ================= CREATE EXAM =================
// POST /api/exams
const createExam = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;

  if (!title || !duration) {
    res.status(400);
    throw new Error("Please provide required fields");
  }

  const exam = await Exam.create({
    title,
    description,
    duration,
    createdBy: req.user._id,
  });

  res.status(201).json(exam);
});

// ================= DELETE EXAM =================
// DELETE /api/exams/:examId
const deleteExamById = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.examId);

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  await exam.deleteOne();

  res.status(200).json({ message: "Exam deleted successfully" });
});

export {
  getExams,
  createExam,
  deleteExamById,
};