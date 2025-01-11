const mongoose = require('mongoose'); //для работы с MongoDB

// Определение схемы теста
const TestSchema = new mongoose.Schema({
  title: { 
    type: String, // Поле типа строка
    required: true // Указывает, что поле обязательно для заполнения
  },
  questions: [
    { 
      question: String, // Поле для текста вопроса (строка)
      answers: [String], // Поле для списка возможных ответов (массив строк)
      correctAnswer: String // Поле для правильного ответа (строка)
    }
  ]
});

// Экспорт модели для использования в других частях приложения
module.exports = mongoose.model('Test', TestSchema);
