import asyncHandler from "express-async-handler";
import Exam from "../models/examModel.js";

// ================= GET ALL EXAMS =================
const getExams = asyncHandler(async (req, res) => {
  const exams = await Exam.find().sort({ createdAt: -1 });
  res.status(200).json(exams);
});

// ================= CREATE EXAM =================
const createExam = asyncHandler(async (req, res) => {
  const {
    examName,
    totalQuestions,
    duration,
    liveDate,
    deadDate,
    bannerImage,
    targetAudience, // NEW
    targetEmails    // NEW
  } = req.body;

  if (!examName || !totalQuestions || !duration || !liveDate || !deadDate) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const now = new Date();

  // convert incoming dates
  let live = new Date(liveDate);
  let dead = new Date(deadDate);

  // if teacher selects current time → make exam live immediately
  if (live <= now) {
    live = now;
  }

  // ensure deadline is after live time
  if (dead <= live) {
    res.status(400);
    throw new Error("Deadline must be after live date");
  }

  const exam = await Exam.create({
    examName,
    totalQuestions,
    duration,
    liveDate: live,
    deadDate: dead,
    bannerImage,
    targetAudience: targetAudience || 'all',
    targetEmails: targetEmails || [],
    createdBy: req.user._id,
  });

  res.status(201).json(exam);
});

// ================= DELETE EXAM =================
const deleteExamById = asyncHandler(async (req, res) => {
  const exam = await Exam.findOne({ examId: req.params.examId });

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  await exam.deleteOne();

  res.status(200).json({
    message: "Exam deleted successfully",
  });
});

export {
  getExams,
  createExam,
  deleteExamById,
};