import mongoose from "mongoose";

const questionSchema = mongoose.Schema(
{
  question: {
    type: String,
    required: true,
  },

  options: [
    {
      optionText: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        required: true,
      },
    },
  ],

  ansmarks: {
    type: Number,
    default: 0,
  },

  examId: {
    type: String,
    required: true,
    index: true
  }

},
{
  timestamps: true,
}
);

const Question = mongoose.model("Question", questionSchema);

export default Question;