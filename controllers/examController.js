import asyncHandler from "express-async-handler";
import Exam from "../models/examModel.js";

// ================= GET ALL EXAMS (FIXED) =================
const getExams = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find all exams
  const exams = await Exam.find().sort({ createdAt: -1 });

  // Map through exams to add a personalized 'isAttempted' flag
  const personalizedExams = exams.map((exam) => {
    // Convert Mongoose document to plain object to add new properties
    const examObj = exam.toObject();

    // Check if current user's ID exists in the attemptedBy array
    // We use .toString() to ensure we are comparing strings, not ObjectIds
    examObj.isAttempted = exam.attemptedBy 
      ? exam.attemptedBy.some((id) => id.toString() === userId.toString()) 
      : false;

    // Optional: Hide the full list of other students' IDs for privacy/security
    delete examObj.attemptedBy; 

    return examObj;
  });

  res.status(200).json(personalizedExams);
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
    targetAudience,
    targetEmails
  } = req.body;

  if (!examName || !totalQuestions || !duration || !liveDate || !deadDate) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const now = new Date();
  let live = new Date(liveDate);
  let dead = new Date(deadDate);

  if (live <= now) live = now;
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
    attemptedBy: [] // Initialize as empty array
  });

  res.status(201).json(exam);
});

// ================= DELETE EXAM =================
const deleteExamById = asyncHandler(async (req, res) => {
  // Use _id or examId consistently based on your schema
  const exam = await Exam.findOne({ _id: req.params.examId });

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  await exam.deleteOne();
  res.status(200).json({ message: "Exam deleted successfully" });
});

export { getExams, createExam, deleteExamById };