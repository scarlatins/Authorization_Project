const express = require('express');
const router = express.Router();
const Test = require('../models/Test'); // Модель тестов
const checkRole = require('../middleware/checkRole');
const passport = require('passport');

// Создание теста (только для преподавателей)
router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  checkRole('teacher'), // Только преподаватель
  async (req, res) => {
    try {
      const { title, questions } = req.body;
      const test = await Test.create({ title, questions });
      res.status(201).json(test);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Удаление теста (только для преподавателей)
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkRole('teacher'), // Только преподаватель
  async (req, res) => {
    try {
      const test = await Test.findByIdAndDelete(req.params.id);
      if (!test) return res.status(404).json({ message: 'Test not found' });
      res.status(200).json({ message: 'Test deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Прохождение теста (только для студентов)
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkRole('student'), // Только студент
  async (req, res) => {
    try {
      const test = await Test.findById(req.params.id);
      if (!test) return res.status(404).json({ message: 'Test not found' });
      res.status(200).json(test);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
