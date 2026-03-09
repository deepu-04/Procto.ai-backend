import asyncHandler from "express-async-handler";
import Question from "../models/quesModel.js";
import CodingQuestion from "../models/codingQuestionModel.js"; // Import Coding model

/*
CREATE QUESTION
Supports MCQ + CODING
*/
const createQuestion = asyncHandler(async (req, res) => {
  const {
    examId,
    section,
    question,
    description,
    image,
    options,
    correctAnswer,
    testCases
  } = req.body;

  if (!examId || !section || !question) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  const newQuestion = await Question.create({
    examId,
    section,
    question,
    description,
    image,
    options,
    correctAnswer,
    testCases,
  });

  res.status(201).json(newQuestion);
});

/*
GET QUESTIONS BY EXAM
Fetches both MCQs and Coding questions and merges them for the frontend
*/
const getQuestionsByExamId = asyncHandler(async (req, res) => {
  const { examId } = req.params;

  // Fetch from both collections
  const mcqQuestions = await Question.find({ examId });
  const codingQuestions = await CodingQuestion.find({ examId });

  // Normalize CodingQuestions so the frontend recognizes them
  const formattedCodingQs = codingQuestions.map(q => ({
    ...q._doc,
    section: "coding",
    type: "coding"
  }));

  // Combine them into one array
  const allQuestions = [...mcqQuestions, ...formattedCodingQs];

  res.status(200).json(allQuestions);
});

export {
  createQuestion,
  getQuestionsByExamId,
};