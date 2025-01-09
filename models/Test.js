const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [{ question: String, answers: [String], correctAnswer: String }]
});

module.exports = mongoose.model('Test', TestSchema);
