import asyncHandler from "express-async-handler";
import Exam from "../models/examModel.js";

const examActiveMiddleware = asyncHandler(async (req, res, next) => {
  const { examId } = req.params;

  if (!examId) {
    res.status(400);
    throw new Error("Exam ID missing");
  }

  const exam = await Exam.findOne({ examId });

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  const now = new Date();

  if (now < exam.liveDate) {
    return res.status(403).json({
      message: "Exam not started",
      status: "NOT_STARTED",
    });
  }

  if (now > exam.deadDate) {
    return res.status(403).json({
      message: "Exam expired",
      status: "EXPIRED",
    });
  }

  req.exam = exam;
  next();
});

export default examActiveMiddleware;
