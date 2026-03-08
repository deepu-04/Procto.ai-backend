const calculateMarks = (questions = [], answers = {}) => {

  let marks = 0;

  questions.forEach((q) => {

    const correctAnswer = q.correctAnswer;

    const userAnswer = answers[q._id];

    if (!userAnswer) return;

    if (userAnswer === correctAnswer) {

      marks += q.ansmarks || 1;

    }

  });

  return marks;

};

export default calculateMarks;