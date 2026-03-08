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

  // Prevent duplicate submission
  const existingResult = await Result.findOne({ examId, userId });

  if (existingResult) {
    res.status(400);
    throw new Error("You already submitted this exam");
  }

  // Fetch questions
  const questions = await Question.find({ examId });

  if (!questions || questions.length === 0) {
    res.status(404);
    throw new Error("No questions found for this exam");
  }

  // ================= SAFE MCQ MARK CALCULATION =================
  let mcqMarks = 0;

  try {

    if (answers && typeof answers === "object") {
      mcqMarks = calculateMarks(questions, answers);
    }

  } catch (err) {

    console.error("calculateMarks crash:", err);

    mcqMarks = 0;

  }

  // ================= SAFE CODING MARKS =================
  let codingMarks = 0;

  if (Array.isArray(codingSubmissions)) {

    codingSubmissions.forEach((submission) => {

      codingMarks += submission?.marks || 0;

    });

  }

  const totalScore = mcqMarks + codingMarks;

  // ================= SAVE RESULT =================
  const result = await Result.create({
    examId,
    userId,
    answers,
    codingSubmissions,
    totalMarks: mcqMarks,
    codingMarks,
    totalScore,
  });

  res.status(201).json({
    success: true,
    message: "Exam submitted successfully",
    data: result,
  });

});

export { submitExam };