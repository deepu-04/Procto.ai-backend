import mongoose from "mongoose";

const resultSchema = mongoose.Schema(
  {
    examId: {
      type: String, // UUID examId
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Updated to accept the Array of objects sent by the frontend
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId },
        selectedOption: { type: Number },
      }
    ],
    codingSubmissions: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId }, // Flexible ref
        code: String,
        language: String,
        marks: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalMarks: {
      type: Number,
      default: 0,
    },
    codingMarks: {
      type: Number,
      default: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    showToStudent: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

resultSchema.index({ examId: 1, userId: 1 }, { unique: true });

const Result = mongoose.model("Result", resultSchema);

export default Result;