const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();
const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB подключен'))
    .catch(err => console.error(err));

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
require('./config/passportConfig')(passport);

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/tests', require('./routes/testRoutes')); // Подключение маршрутов для тестов

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер работает на порту ${PORT}`));
