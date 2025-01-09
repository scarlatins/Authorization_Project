const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Функция для генерации токена
const generateToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// GitHub OAuth
router.get('/github', passport.authenticate('github'));
router.get('/github/callback', passport.authenticate('github', { session: false }), (req, res) => {
    const token = generateToken(req.user);
    res.json({ token });
});

// Yandex OAuth
router.get('/yandex', passport.authenticate('yandex'));
router.get('/yandex/callback', passport.authenticate('yandex', { session: false }), (req, res) => {
    const token = generateToken(req.user);
    res.json({ token });
});

// Пример маршрута для регистрации
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Проверка, что все необходимые данные переданы
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Пожалуйста, заполните все поля (username, email, password)' });
    }

    try {
        // Проверка, существует ли уже пользователь с таким email или username
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким именем или email уже существует' });
        }

        // Создание нового пользователя
        const newUser = new User({ username, email, password });
        await newUser.save(); // Сохраняем пользователя в базе данных

        // Генерация токена для нового пользователя
        const token = generateToken(newUser);

        res.status(201).json({ message: 'Регистрация успешна', token });
    } catch (err) {
        console.error('Ошибка регистрации:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Ошибка при регистрации', error: err.message });
    }
});

// Пример защищенного маршрута
router.get('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        res.json(user);
    } catch (err) {
        console.error('Ошибка авторизации:', err);
        res.status(401).json({ message: 'Unauthorized' });
    }
});

module.exports = router;
