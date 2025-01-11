const express = require('express');
const router = express.Router();
const Test = require('../models/Test'); // Подключаем модель для работы с тестами
const checkRole = require('../middleware/checkRole'); // Middleware для проверки роли пользователя
const passport = require('passport'); // Passport для аутентификации

// Создание теста (доступно только для преподавателей)
router.post(
  '/create',
  passport.authenticate('jwt', { session: false }), // Проверка JWT токена для аутентификации
  checkRole('teacher'), // Проверка роли пользователя (только преподаватель может выполнять этот маршрут)
  async (req, res) => {
    try {
      const { title, questions } = req.body; // Получение данных теста из тела запроса
      const test = await Test.create({ title, questions }); // Создание нового теста в базе данных
      res.status(201).json(test); // Возврат созданного теста с HTTP статусом 201 (Created)
    } catch (err) {
      res.status(500).json({ error: err.message }); // Обработка ошибок (внутренняя ошибка сервера)
    }
  }
);

// Удаление теста (доступно только для преподавателей)
router.delete(
  '/:id', // Маршрут принимает ID теста как параметр
  passport.authenticate('jwt', { session: false }), // Проверка JWT токена для аутентификации
  checkRole('teacher'), // Проверка роли пользователя (только преподаватель может выполнять этот маршрут)
  async (req, res) => {
    try {
      const test = await Test.findByIdAndDelete(req.params.id); // Поиск и удаление теста по ID
      if (!test) return res.status(404).json({ message: 'Test not found' }); // Если тест не найден, возвращаем 404
      res.status(200).json({ message: 'Test deleted' }); // Возврат сообщения об успешном удалении теста
    } catch (err) {
      res.status(500).json({ error: err.message }); // Обработка ошибок (внутренняя ошибка сервера)
    }
  }
);

// Прохождение теста (доступно только для студентов)
router.get(
  '/:id', // Маршрут принимает ID теста как параметр
  passport.authenticate('jwt', { session: false }), // Проверка JWT токена для аутентификации
  checkRole('student'), // Проверка роли пользователя (только студент может выполнять этот маршрут)
  async (req, res) => {
    try {
      const test = await Test.findById(req.params.id); // Поиск теста по ID
      if (!test) return res.status(404).json({ message: 'Test not found' }); // Если тест не найден, возвращаем 404
      res.status(200).json(test); // Возврат данных теста с HTTP статусом 200 (OK)
    } catch (err) {
      res.status(500).json({ error: err.message }); // Обработка ошибок (внутренняя ошибка сервера)
    }
  }
);

module.exports = router; // Экспортируем маршруты для подключения в основном приложении
