
const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stats: {
    totalExams: Number,
    avgScore: Number,
    topStrength: String,
    criticalGap: String
  },
  history: [{
    month: String,
    score: Number
  }],
  gaps: [{
    subject: String,
    actual: Number,
    expected: Number
  }],
  exams: [{
    id: String,
    name: String,
    score: Number,
    status: String,
    date: String
  }]
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);