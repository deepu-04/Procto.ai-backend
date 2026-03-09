import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const examSchema = mongoose.Schema(
  {
    examName: {
      type: String,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    liveDate: {
      type: Date,
      required: true,
    },
    deadDate: {
      type: Date,
      required: true,
    },
    bannerImage: {
      type: String,
      default: "",
    },
    examId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Added fields to match frontend Step 1
    targetAudience: {
      type: String,
      enum: ['all', 'specific'],
      default: 'all'
    },
    targetEmails: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
  }
);

const Exam = mongoose.model("Exam", examSchema);

export default Exam;