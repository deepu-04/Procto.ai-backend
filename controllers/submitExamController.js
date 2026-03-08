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

  // ================= MCQ MARK CALCULATION =================
  let mcqMarks = 0;

  try {

    if (answers && typeof answers === "object") {
      mcqMarks = calculateMarks(questions, answers);
    }

  } catch (err) {

    console.error("calculateMarks crash:", err);
    mcqMarks = 0;

  }

  // ================= CODING MARKS =================
  let codingMarks = 0;
  const safeCodingSubmissions = [];

  if (Array.isArray(codingSubmissions)) {

    codingSubmissions.forEach((submission) => {

      const marks = submission?.marks || 0;
      codingMarks += marks;

      safeCodingSubmissions.push({
        questionId: submission?.questionId || null,
        code: submission?.code || "",
        language: submission?.language || "javascript",
        marks: marks,
      });

    });

  }

  // ================= TOTAL SCORE =================
  const totalScore = mcqMarks + codingMarks;

  // ================= TOTAL POSSIBLE MARKS =================
  const totalQuestions = questions.length;

  const percentage =
    totalQuestions > 0
      ? Number(((totalScore / totalQuestions) * 100).toFixed(2))
      : 0;

  // ================= SAVE RESULT =================
  const result = await Result.create({
    examId,
    userId,
    answers,
    codingSubmissions: safeCodingSubmissions,
    totalMarks: mcqMarks,
    codingMarks,
    totalScore,
    percentage,
  });

  // ================= RESPONSE =================
  res.status(201).json({
    success: true,
    message: "Exam submitted successfully",
    data: result,
  });

});

export { submitExam };