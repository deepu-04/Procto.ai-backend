const calculateMarks = (questions, answers) => {
  let totalMarks = 0;

  questions.forEach((question) => {
    const userAnswer = answers?.find(
      (ans) => ans.questionId === question._id.toString()
    );

    if (!userAnswer) return;

    const correctOption = question.options.find((opt) => opt.isCorrect);

    if (correctOption?.optionText === userAnswer.selectedOption) {
      totalMarks += question.ansmarks || 1;
    }
  });

  return totalMarks;
};

export default calculateMarks;