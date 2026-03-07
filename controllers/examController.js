import asyncHandler from "express-async-handler";
import Question from "../models/quesModel.js";



// ================= CREATE MCQ QUESTION =================
// POST /api/questions
const createQuestion = asyncHandler(async (req, res) => {

  const { question, options, examId } = req.body;

  if (!question || !options || !examId) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  const newQuestion = await Question.create({
    question,
    options,
    examId
  });

  res.status(201).json(newQuestion);

});



// ================= GET QUESTIONS BY EXAM =================
// GET /api/questions/:examId
const getQuestionsByExamId = asyncHandler(async (req, res) => {

  const { examId } = req.params;

  const questions = await Question.find({ examId }).lean();

  res.status(200).json(questions);

});



export {
  createQuestion,
  getQuestionsByExamId
};