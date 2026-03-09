import asyncHandler from "express-async-handler";
import Question from "../models/quesModel.js";
import CodingQuestion from "../models/codingQuestionModel.js";
import Result from "../models/resultModel.js";
// ================= CRITICAL IMPORT =================
import Exam from "../models/examModel.js"; 

const submitExam = asyncHandler(async (req, res) => {
  const { examId, answers = [], codingSubmissions = [] } = req.body;

  // ================= VALIDATE EXAM ID =================
  if (!examId || typeof examId !== "string") {
    return res.status(400).json({ message: "Valid exam ID is required" });
  }

  const userId = req.user._id;

  // ================= PREVENT DUPLICATE SUBMISSION =================
  const existingResult = await Result.findOne({ examId, userId });
  if (existingResult) {
    return res.status(400).json({ message: "You already submitted this exam" });
  }

  // ================= FETCH ALL QUESTIONS (MCQ + CODING) =================
  const mcqQuestions = await Question.find({ examId });
  const codingQuestions = await CodingQuestion.find({ examId });
  const allQuestions = [...mcqQuestions, ...codingQuestions];

  if (allQuestions.length === 0) {
    return res.status(404).json({ message: "No questions found for this exam" });
  }

  // ================= CALCULATE MCQ MARKS =================
  let mcqMarks = 0;
  try {
    if (Array.isArray(answers)) {
      answers.forEach(ans => {
        const q = mcqQuestions.find(q => q._id.toString() === ans.questionId?.toString());
        // Check if the selected option index matches the correct answer index
        if (q && q.correctAnswer === ans.selectedOption) {
          mcqMarks += (q.ansmarks || 1); // Default to 1 mark per question if not specified
        }
      });
    }
  } catch (err) {
    console.error("MCQ calculation error:", err);
    mcqMarks = 0;
  }

  // ================= FORMAT CODING SUBMISSIONS =================
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
        marks
      });
    });
  }

  // ================= TOTAL SCORE =================
  const totalScore = mcqMarks + codingMarks;

  // Calculate maximum possible marks
  const totalMarksPossible = allQuestions.reduce((sum, q) => sum + (q.ansmarks || 1), 0);

  const percentage = totalMarksPossible > 0
      ? Number(((totalScore / totalMarksPossible) * 100).toFixed(2))
      : 0;

  // ================= SAVE RESULT =================
  const result = await Result.create({
    examId,
    userId,
    answers, // Saves the array of { questionId, selectedOption }
    codingSubmissions: safeCodingSubmissions,
    totalMarks: mcqMarks,
    codingMarks,
    totalScore,
    percentage
  });

  // ================= CRITICAL FIX: MARK AS ATTEMPTED =================
  // Safely find the exam by UUID or MongoDB _id and push the user's ID into the array
  const orConditions = [{ examId: examId }];
  if (examId.match(/^[0-9a-fA-F]{24}$/)) {
      orConditions.push({ _id: examId });
  }

  await Exam.findOneAndUpdate(
    { $or: orConditions },
    { $addToSet: { attemptedBy: userId } } // $addToSet guarantees the ID is added only once
  );

  // ================= RESPONSE =================
  res.status(201).json({
    success: true,
    message: "Exam submitted successfully",
    data: result
  });
});

export default submitExam;