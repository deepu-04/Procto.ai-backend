import asyncHandler from "express-async-handler";
import Question from "../models/quesModel.js";
import CodingQuestion from "../models/codingQuestionModel.js";
import Result from "../models/resultModel.js";
import Exam from "../models/examModel.js";

const submitExam = asyncHandler(async (req, res) => {
  const { examId, answers = [], codingSubmissions = [] } = req.body;
  const userId = req.user._id;

  if (!examId) {
    return res.status(400).json({ message: "Valid exam ID is required" });
  }

  // 1. Prevent Duplicate Submission
  const existingResult = await Result.findOne({ examId, userId });
  if (existingResult) {
    return res.status(400).json({ message: "You already submitted this exam" });
  }

  // 2. Fetch Questions
  const [mcqQuestions, codingQuestions] = await Promise.all([
    Question.find({ examId }),
    CodingQuestion.find({ examId })
  ]);

  if (mcqQuestions.length === 0 && codingQuestions.length === 0) {
    return res.status(404).json({ message: "No questions found for this exam" });
  }

  // 3. Logic for Marks (Simplified for brevity, keep your original logic here)
  let mcqMarks = 0;
  answers.forEach(ans => {
    const q = mcqQuestions.find(q => q._id.toString() === ans.questionId?.toString());
    if (q && q.correctAnswer === ans.selectedOption) {
      mcqMarks += (q.ansmarks || 1);
    }
  });

  let codingMarks = 0;
  const safeCodingSubmissions = codingSubmissions.map(sub => {
    codingMarks += (sub.marks || 0);
    return { ...sub };
  });

  const totalScore = mcqMarks + codingMarks;
  const totalMarksPossible = [...mcqQuestions, ...codingQuestions].reduce((sum, q) => sum + (q.ansmarks || 1), 0);
  const percentage = totalMarksPossible > 0 ? Number(((totalScore / totalMarksPossible) * 100).toFixed(2)) : 0;

  // 4. Save Result
  const result = await Result.create({
    examId,
    userId,
    answers,
    codingSubmissions: safeCodingSubmissions,
    totalMarks: mcqMarks,
    codingMarks,
    totalScore,
    percentage
  });

  // 5. CRITICAL FIX: Push only the current user to the attemptedBy array
  // Use findOneAndUpdate with $addToSet to prevent duplicates
  await Exam.findByIdAndUpdate(
    examId,
    { $addToSet: { attemptedBy: userId } },
    { new: true }
  );

  res.status(201).json({
    success: true,
    message: "Exam submitted successfully",
    data: result
  });
});

export default submitExam;