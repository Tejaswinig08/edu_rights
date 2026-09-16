import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true,
  },
  questions: [
    {
      question: String,
      options: [String],
      correctIndex: Number,
      explanation: String,
    },
  ],
});

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
