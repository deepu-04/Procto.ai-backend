import CodingQuestion from "../models/codingQuestionModel.js";
import asyncHandler from "express-async-handler";

// @desc    Submit a coding answer
// @route   POST /api/coding/submit
// @access  Private (Student)
const submitCodingAnswer = asyncHandler(async (req, res) => {
  const { questionId, code, language } = req.body;

  if (!code || !language || !questionId) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const question = await CodingQuestion.findById(questionId);
  if (!question) {
    res.status(404);
    throw new Error("Question not found");
  }

  question.submittedAnswer = {
    code,
    language,
    status: "pending", 
    executionTime: 0, 
  };

  const updatedQuestion = await question.save();

  res.status(200).json({
    success: true,
    data: updatedQuestion,
  });
});

// @desc    Create a new coding question
// @route   POST /api/coding/question
// @access  Private (Teacher)
const createCodingQuestion = asyncHandler(async (req, res) => {
  // FIX: Added 'image' and 'testCases' so they are actually saved to the database
  const { question, description, image, testCases, examId } = req.body;
  
  console.log("Received coding question data:", {
    question,
    description,
    examId,
    testCasesCount: testCases ? testCases.length : 0
  });

  if (!question || !description || !examId) {
    const missingFields = [];
    if (!question) missingFields.push("question");
    if (!description) missingFields.push("description");
    if (!examId) missingFields.push("examId");

    res.status(400);
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  try {
    const existingQuestion = await CodingQuestion.findOne({
      examId: examId.toString(),
    });
    console.log("Existing question check:", existingQuestion);

    if (existingQuestion) {
      res.status(400);
      throw new Error(`A coding question already exists for exam: ${examId}`);
    }

    // FIX: Include testCases and image in the creation payload
    const newQuestion = await CodingQuestion.create({
      question,
      description,
      image,
      testCases, 
      examId: examId.toString(),
      teacher: req.user._id,
    });

    console.log("Created new question successfully.");

    res.status(201).json({
      success: true,
      data: newQuestion,
    });
  } catch (error) {
    console.error("Error creating coding question:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      details: error.stack,
    });
  }
});

// @desc    Get all coding questions
// @route   GET /api/coding/questions
// @access  Private
const getCodingQuestions = asyncHandler(async (req, res) => {
  const questions = await CodingQuestion.find()
    .select("-submittedAnswer") 
    .populate("teacher", "name email");

  res.status(200).json({
    success: true,
    count: questions.length,
    data: questions,
  });
});

// @desc    Get a single coding question
// @route   GET /api/coding/questions/:id
// @access  Private
const getCodingQuestion = asyncHandler(async (req, res) => {
  const question = await CodingQuestion.findById(req.params.id).populate(
    "teacher",
    "name email"
  );

  if (!question) {
    res.status(404);
    throw new Error("Question not found");
  }

  res.status(200).json({
    success: true,
    data: question,
  });
});

// @desc    Get coding questions by exam ID
// @route   GET /api/coding/questions/exam/:examId
// @access  Private
const getCodingQuestionsByExamId = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  console.log("Fetching question for examId:", examId);

  if (!examId) {
    res.status(400);
    throw new Error("Exam ID is required");
  }

  try {
    // FIX: Changed from `findOne` to `find`. 
    // The frontend map function requires an Array of questions, not a single Object!
    const questions = await CodingQuestion.find({
      examId: examId.toString(),
    });
    
    console.log(`Found ${questions.length} questions.`);

    // Even if it's empty, we return an empty array to prevent frontend crashes
    res.status(200).json({
      success: true,
      data: questions, 
    });
  } catch (error) {
    console.error("Error fetching coding question:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      details: error.stack,
    });
  }
});

export {
  submitCodingAnswer,
  createCodingQuestion,
  getCodingQuestions,
  getCodingQuestion,
  getCodingQuestionsByExamId,
};