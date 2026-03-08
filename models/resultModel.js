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

    answers: {
      type: Map,
      of: String,
      default: {},
    },

    codingSubmissions: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "CodingQuestion",
        },
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