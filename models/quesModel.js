import mongoose from "mongoose";

const testCaseSchema = mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
});

const questionSchema = mongoose.Schema(
  {
    examId: {
      type: String,
      required: true,
      index: true,
    },

    section: {
      type: String,
      enum: ["coding", "aptitude", "verbal"],
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    options: {
      type: [String],
      default: [],
    },

    correctAnswer: {
      type: Number,
      default: null,
    },

    testCases: {
      type: [testCaseSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;