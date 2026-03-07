const calculateMarks = (questions, userResponses) => {
  let totalMarks = 0;

  questions.forEach((question) => {
    const userAnswer = userResponses[question._id];

    const correctOption = question.options.find(
      (option) => option.isCorrect
    );

    if (correctOption && correctOption.optionText === userAnswer) {
      totalMarks += question.ansmarks || 1;
    }
  });

  return totalMarks;
};

export default calculateMarks;