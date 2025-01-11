const mongoose = require('mongoose'); //для работы с MongoDB
const bcrypt = require('bcryptjs'); //для шифровки паролей

// Схема для пользователя
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,  // Поле обязательное
        unique: true,    // Поле должно быть уникальным
        lowercase: true, // Преобразует email в нижний регистр
        match: [/.+\@.+\..+/, 'Пожалуйста, введите корректный email'] // Валидация email
    },
    password: {
        type: String,
        required: true
    },
    githubId: { type: String },                              // ID GitHub пользователя
    yandexId: { type: String },                              // ID Yandex пользователя
    token: { type: String },                                 // JWT токен
    role: { type: String, enum: ['student', 'teacher'], default: 'student' } // Поле роли
}, { timestamps: true }); // Автоматическое добавление времени создания/обновления


const User = mongoose.model('User', userSchema);

module.exports = User;
