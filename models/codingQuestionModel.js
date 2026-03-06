import mongoose from "mongoose";

const codingQuestionSchema = new mongoose.Schema(
  {
    examId: { type: String, required: true },

    question: { type: String, required: true },
    description: { type: String, required: true },

    
    image: {
      type: String, 
    },


    testCases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        isHidden: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("CodingQuestion", codingQuestionSchema);
