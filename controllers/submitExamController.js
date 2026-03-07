import asyncHandler from "express-async-handler";
import Question from "../models/quesModel.js";
import Result from "../models/resultModel.js";
import calculateMarks from "../utils/calculateMarks.js";

// ================= SUBMIT EXAM =================
// POST /api/results/submit

const submitExam = asyncHandler(async (req, res) => {
  const { examId, answers, codingSubmissions } = req.body;

  if (!examId) {
    res.status(400);
    throw new Error("Exam ID is required");
  }

  if (!answers) {
    res.status(400);
    throw new Error("Answers are required");
  }

  const userId = req.user._id;

  // ================= PREVENT DUPLICATE SUBMISSION =================
  const existingResult = await Result.findOne({ examId, userId });

  if (existingResult) {
    res.status(400);
    throw new Error("You have already submitted this exam");
  }

  // ================= GET MCQ QUESTIONS =================
  const questions = await Question.find({ examId });

  // ================= CALCULATE MCQ MARKS =================
  const mcqMarks = calculateMarks(questions, answers);

  // ================= CALCULATE CODING MARKS =================
  let codingMarks = 0;

  if (Array.isArray(codingSubmissions) && codingSubmissions.length > 0) {
    codingSubmissions.forEach((submission) => {
      codingMarks += submission.marks || 0;
    });
  }

  // ================= TOTAL SCORE =================
  const totalScore = mcqMarks + codingMarks;

  // ================= TOTAL POSSIBLE MARKS =================
  const totalMcqMarks = questions.reduce(
    (sum, q) => sum + (q.ansmarks || 1),
    0
  );

  const totalPossibleMarks = totalMcqMarks + codingMarks;

  // ================= PERCENTAGE =================
  const percentage =
    totalPossibleMarks > 0
      ? (totalScore / totalPossibleMarks) * 100
      : 0;

  // ================= SAVE RESULT =================
  const result = await Result.create({
    examId,
    userId,
    answers,
    codingSubmissions,
    totalMarks: mcqMarks,
    codingMarks,
    totalScore,
    percentage,
  });

  res.status(201).json({
    success: true,
    message: "Exam submitted successfully",
    data: result,
  });
});

export { submitExam };