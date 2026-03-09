import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Question from "../models/quesModel.js";
import CodingQuestion from "../models/codingQuestionModel.js";
import Result from "../models/resultModel.js";
import Exam from "../models/examModel.js";

const submitExam = asyncHandler(async (req, res) => {
  const { examId, answers = [], codingSubmissions = [] } = req.body;
  const userId = req.user._id;

  if (!examId) {
    return res.status(400).json({ message: "Exam ID is required" });
  }

  // 1. RESOLVE EXAM ID (Crucial Fix for the UUID Error)
  // This allows the frontend to send EITHER a MongoDB _id OR a custom UUID
  const searchConditions = [{ examId: examId }];
  if (mongoose.Types.ObjectId.isValid(examId)) {
    searchConditions.push({ _id: examId });
  }

  const exam = await Exam.findOne({ $or: searchConditions });
  
  if (!exam) {
    return res.status(404).json({ message: `Exam not found for ID: ${examId}` });
  }

  // Use the verified string ID for querying questions and results
  const targetExamId = exam.examId || examId; 

  // 2. Prevent Duplicate Submission
  const existingResult = await Result.findOne({ examId: targetExamId, userId });
  if (existingResult) {
    return res.status(400).json({ message: "You have already submitted this exam" });
  }

  // 3. Fetch Questions in Parallel
  const [mcqQuestions, codingQuestions] = await Promise.all([
    Question.find({ $or: [{ examId: targetExamId }, { examId: exam._id }] }),
    CodingQuestion.find({ $or: [{ examId: targetExamId }, { examId: exam._id }] })
  ]);

  if (mcqQuestions.length === 0 && codingQuestions.length === 0) {
    return res.status(404).json({ message: "No questions found for this exam" });
  }

  // 4. Calculate MCQ Marks (Handling both Object and Array incoming formats)
  let mcqMarks = 0;
  const mcqAnswersArray = Array.isArray(answers) 
    ? answers 
    : Object.entries(answers).map(([qId, opt]) => ({ questionId: qId, selectedOption: opt }));

  mcqAnswersArray.forEach(ans => {
    const q = mcqQuestions.find(q => q._id.toString() === ans.questionId?.toString());
    if (q && String(q.correctAnswer).trim() === String(ans.selectedOption).trim()) {
      mcqMarks += (Number(q.ansmarks) || 1);
    }
  });

  // 5. Calculate Coding Marks 
  let codingMarks = 0;
  codingSubmissions.forEach(sub => {
    codingMarks += (Number(sub.marks) || 0);
  });

  // 6. Calculate Totals and Percentage
  const totalScore = mcqMarks + codingMarks;
  
  const totalMcqPossible = mcqQuestions.reduce((sum, q) => sum + (Number(q.ansmarks) || 1), 0);
  const totalCodingPossible = codingQuestions.reduce((sum, q) => sum + (Number(q.ansmarks) || 10), 0);
  const totalMarksPossible = totalMcqPossible + totalCodingPossible;

  const percentage = totalMarksPossible > 0 
    ? Number(((totalScore / totalMarksPossible) * 100).toFixed(2)) 
    : 0;

  // 7. Save Result Record
  const result = await Result.create({
    examId: targetExamId,
    userId,
    answers: mcqAnswersArray,
    codingSubmissions,
    totalMarks: mcqMarks,
    codingMarks,
    totalScore,
    percentage
  });

  // 8. Atomic update to Exam model using the true MongoDB _id
  await Exam.findByIdAndUpdate(
    exam._id,
    { $addToSet: { attemptedBy: userId } },
    { new: true }
  );

  res.status(201).json({
    success: true,
    message: "Exam submitted successfully",
    data: {
      score: totalScore,
      total: totalMarksPossible,
      percentage: percentage + "%",
      resultId: result._id
    }
  });
});

export default submitExam;