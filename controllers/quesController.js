import asyncHandler from "express-async-handler";
import Question from "../models/quesModel.js";

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
*/
const getQuestionsByExamId = asyncHandler(async (req, res) => {

  const { examId } = req.params;

  const questions = await Question.find({ examId });

  res.status(200).json(questions);

});

export {
  createQuestion,
  getQuestionsByExamId,
};