const express = require('express'); // Подключение Express для создания сервера
const mongoose = require('mongoose'); //для работы с MongoDB
const dotenv = require('dotenv'); // Подключение dotenv для работы с переменными окружения
const passport = require('passport'); // Подключение Passport для авторизации
const bodyParser = require('body-parser'); // Подключение body-parser для обработки JSON-запросов
const cors = require('cors'); // Подключение CORS для разрешения запросов с других доменов

dotenv.config(); // Загрузка переменных окружения из файла .env
const app = express(); // Создание экземпляра приложения Express

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB подключен')) 
    .catch(err => console.error(err)); // Вывод ошибки, если подключение не удалось

// Middleware для обработки запросов
app.use(bodyParser.json()); // Обработка JSON в теле запросов
app.use(cors()); // Разрешение кросс-доменных запросов
app.use(passport.initialize()); // Инициализация Passport для работы с авторизацией
require('./config/passportConfig')(passport); // Импорт и настройка конфигурации Passport

// Определение маршрутов
app.use('/auth', require('./routes/auth')); // Маршруты для авторизации
app.use('/tests', require('./routes/testRoutes')); // Маршруты для работы с тестами

// Запуск сервера
const PORT = process.env.PORT || 3000; // Установка порта 
app.listen(PORT, () => console.log(`Сервер работает на порту ${PORT}`)); // Запуск сервера и вывод сообщения о запуске
