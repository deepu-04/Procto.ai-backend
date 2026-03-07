import asyncHandler from "express-async-handler";
import CodingQuestion from "../models/codingQuestionModel.js";
import Result from "../models/resultModel.js";


// ================= SUBMIT CODING ANSWER =================
// POST /api/coding/submit
// Student submits code
const submitCodingAnswer = asyncHandler(async (req, res) => {

  const { examId, questionId, code, language } = req.body;

  if (!examId || !questionId || !code || !language) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  const question = await CodingQuestion.findById(questionId);

  if (!question) {
    res.status(404);
    throw new Error("Coding question not found");
  }

  let result = await Result.findOne({
    examId,
    userId: req.user._id
  });

  if (!result) {
    result = await Result.create({
      examId,
      userId: req.user._id,
      answers: {},
      codingSubmissions: []
    });
  }

  const existingSubmission = result.codingSubmissions.find(
    (s) => s.questionId.toString() === questionId
  );

  if (existingSubmission) {

    existingSubmission.code = code;
    existingSubmission.language = language;

  } else {

    result.codingSubmissions.push({
      questionId,
      code,
      language,
      marks: 0
    });

  }

  await result.save();

  res.status(200).json({
    success: true,
    message: "Coding answer saved successfully",
    data: result
  });

});



// ================= CREATE CODING QUESTION =================
// POST /api/coding/question
// Teacher creates coding question
const createCodingQuestion = asyncHandler(async (req, res) => {

  const { question, description, examId } = req.body;

  if (!question || !description || !examId) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  const newQuestion = await CodingQuestion.create({
    question,
    description,
    examId,
    teacher: req.user._id
  });

  res.status(201).json({
    success: true,
    data: newQuestion
  });

});



// ================= GET ALL CODING QUESTIONS =================
// GET /api/coding/questions
const getCodingQuestions = asyncHandler(async (req, res) => {

  const questions = await CodingQuestion.find()
    .populate("teacher", "name email");

  res.status(200).json({
    success: true,
    count: questions.length,
    data: questions
  });

});



// ================= GET SINGLE CODING QUESTION =================
// GET /api/coding/questions/:id
const getCodingQuestion = asyncHandler(async (req, res) => {

  const question = await CodingQuestion.findById(req.params.id)
    .populate("teacher", "name email");

  if (!question) {
    res.status(404);
    throw new Error("Question not found");
  }

  res.status(200).json({
    success: true,
    data: question
  });

});



// ================= GET CODING QUESTIONS BY EXAM =================
// GET /api/coding/questions/exam/:examId
const getCodingQuestionsByExamId = asyncHandler(async (req, res) => {

  const { examId } = req.params;

  const questions = await CodingQuestion.find({ examId });

  res.status(200).json({
    success: true,
    count: questions.length,
    data: questions
  });

});



export {
  submitCodingAnswer,
  createCodingQuestion,
  getCodingQuestions,
  getCodingQuestion,
  getCodingQuestionsByExamId,
};