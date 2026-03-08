import mongoose from "mongoose";

const resultSchema = mongoose.Schema(
  {
    // ================= EXAM =================
    examId: {
      type: String, // ✅ FIXED (UUID support)
      required: true,
      index: true,
    },

    // ================= USER =================
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ================= MCQ ANSWERS =================
    answers: {
      type: Map,
      of: String,
      default: {},
    },

    // ================= CODING SUBMISSIONS =================
    codingSubmissions: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "CodingQuestion",
          required: true,
        },

        code: {
          type: String,
          default: "",
        },

        language: {
          type: String,
          default: "javascript",
        },

        marks: {
          type: Number,
          default: 0,
        },

        status: {
          type: String,
          enum: ["pending", "passed", "failed"],
          default: "pending",
        },

        executionTime: {
          type: Number,
          default: 0,
        },
      },
    ],

    // ================= MCQ SCORE =================
    totalMarks: {
      type: Number,
      default: 0,
    },

    // ================= CODING SCORE =================
    codingMarks: {
      type: Number,
      default: 0,
    },

    // ================= FINAL SCORE =================
    totalScore: {
      type: Number,
      default: 0,
    },

    percentage: {
      type: Number,
      default: 0,
    },

    // ================= VISIBILITY =================
    showToStudent: {
      type: Boolean,
      default: false,
    },

    // ================= TEACHER FEEDBACK =================
    feedback: {
      type: String,
      default: "",
    },

    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    gradedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// ================= PREVENT DUPLICATE RESULTS =================
resultSchema.index({ examId: 1, userId: 1 }, { unique: true });

const Result = mongoose.model("Result", resultSchema);

export default Result;