import Result from "../models/resultModel.js";
import mongoose from "mongoose";


export const saveAiExamResult = async (req, res) => {
  try {
    const { userId, examName, answers, totalMarks, score, percentage, trustScore, securityLog } = req.body;

    
    const dummyExamId = new mongoose.Types.ObjectId();

    
    const formattedAnswers = {};
    if (answers) {
      Object.keys(answers).forEach(k => {
        formattedAnswers[k] = String(answers[k]);
      });
    }

    const newResult = new Result({
      examId: dummyExamId, 
      userId: userId,
      answers: formattedAnswers,
      totalMarks: totalMarks,
      percentage: percentage,
      totalScore: score,
      showToStudent: true,
      feedback: `AI Exam: ${examName}. Trust Score: ${trustScore}%` 
    });

    await newResult.save();
    res.status(201).json(newResult);
  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getStudentAnalytics = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ message: "User ID required" });

    const results = await Result.find({ userId: userId }).sort({ createdAt: 1 });

    if (!results || results.length === 0) {
      return res.json({
        stats: { totalExams: 0, avgScore: 0, topStrength: "N/A", criticalGap: "N/A" },
        history: [], gaps: [], exams: []
      });
    }

    const totalExams = results.length;
    const totalScore = results.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
    const avgScore = Math.round(totalScore / totalExams);

    const historyMap = {};
    results.forEach(r => {
      const month = new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short' });
      if (!historyMap[month]) historyMap[month] = { sum: 0, count: 0 };
      historyMap[month].sum += (r.percentage || 0);
      historyMap[month].count += 1;
    });
    
    const history = Object.keys(historyMap).map(month => ({
      month, score: Math.round(historyMap[month].sum / historyMap[month].count)
    }));

    const subjectMap = {};
    results.forEach(r => {
      
      let subjectName = "General AI Exam";
      if (r.feedback && r.feedback.includes("AI Exam:")) {
        subjectName = r.feedback.split('.')[0].replace('AI Exam: ', '').trim();
      }
      if (!subjectMap[subjectName]) subjectMap[subjectName] = [];
      subjectMap[subjectName].push(r.percentage || 0);
    });

    const gaps = Object.keys(subjectMap).map(subject => {
      const actualAvg = Math.round(subjectMap[subject].reduce((a, b) => a + b, 0) / subjectMap[subject].length);
      return { subject: subject, actual: actualAvg, expected: 85 }; 
    });

    const sortedGaps = [...gaps].sort((a, b) => (b.expected - b.actual) - (a.expected - a.actual));
    const criticalGap = sortedGaps.length > 0 && (sortedGaps[0].expected - sortedGaps[0].actual > 0) ? sortedGaps[0].subject : "None";
    const topStrength = [...gaps].sort((a, b) => b.actual - a.actual)[0]?.subject || "N/A";

    const exams = results.slice(-5).reverse().map(r => {
      let subjectName = "AI Exam";
      if (r.feedback && r.feedback.includes("AI Exam:")) {
        subjectName = r.feedback.split('.')[0].replace('AI Exam: ', '').trim();
      }
      return {
        id: r._id.toString().slice(-6).toUpperCase(),
        name: subjectName,
        score: r.percentage || 0,
        status: (r.percentage || 0) >= 60 ? "Passed" : "Needs Review",
        date: new Date(r.createdAt).toLocaleDateString()
      };
    });

    res.status(200).json({
      stats: { totalExams, avgScore, topStrength, criticalGap },
      history, gaps, exams
    });

  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};