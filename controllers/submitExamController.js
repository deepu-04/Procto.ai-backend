import asyncHandler from "express-async-handler";
import Question from "../models/quesModel.js";
import Result from "../models/resultModel.js";
import calculateMarks from "../utils/calculateMarks.js";

const submitExam = asyncHandler(async (req, res) => {

  const { examId, answers = {}, codingSubmissions = [] } = req.body;

  if (!examId) {
    res.status(400);
    throw new Error("Exam ID is required");
  }

  const userId = req.user._id;

  // ================= PREVENT DUPLICATE SUBMISSION =================
  const existingResult = await Result.findOne({ examId, userId });

  if (existingResult) {
    res.status(400);
    throw new Error("You already submitted this exam");
  }

  // ================= FETCH QUESTIONS =================
  const questions = await Question.find({ examId });

  if (!questions || questions.length === 0) {
    res.status(404);
    throw new Error("No questions found for this exam");
  }

  // ================= CALCULATE MCQ MARKS =================
  let mcqMarks = 0;

  try {
    mcqMarks = calculateMarks(questions, answers || {});
  } catch (error) {
    console.error("MCQ calculation error:", error);
    mcqMarks = 0;
  }

  // ================= CALCULATE CODING MARKS =================
  let codingMarks = 0;

  if (Array.isArray(codingSubmissions) && codingSubmissions.length > 0) {
    codingSubmissions.forEach((submission) => {
      codingMarks += submission?.marks || 0;
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
    answers: answers || {},
    codingSubmissions: codingSubmissions || [],
    totalMarks: mcqMarks,
    codingMarks,
    totalScore,
    percentage
  });

  res.status(201).json({
    success: true,
    message: "Exam submitted successfully",
    data: result
  });

});

export { submitExam };