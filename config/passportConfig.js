const GitHubStrategy = require('passport-github').Strategy; //OAuth GitHub
const YandexStrategy = require('passport-yandex').Strategy; //OAuth Yandex
const User = require('../models/User'); //Модель юзера для работы с MongoDB

async function findOrCreateUser(query, userData) { //ищется или создаётся новый юзер
    let user = await User.findOne(query);
    if (!user) {
        user = await User.create(userData);
    }
    return user;
}

module.exports = (passport) => {
    passport.serializeUser((user, done) => done(null, user.id)); //какие данные о пользователе будут сохранены в сессии.(user.id)
    passport.deserializeUser((id, done) => { //использует сохранённый в сессии ID для поиска пользователя в базе данных. Затем передаёт объект пользователя в done
        User.findById(id, (err, user) => done(err, user));
    });

    // GitHub Strategy
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) { //проверка .env на заполненнные поля
        throw new Error('Missing GitHub OAuth environment variables');
    }

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'https://authorizationproject-production.up.railway.app/auth/github/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await findOrCreateUser(
                { githubId: profile.id },
                {
                    username: profile.username,
                    githubId: profile.id,
                    email: profile.emails && profile.emails[0] ? profile.emails[0].value : null
                }
            );
            return done(null, user);
        } catch (err) {
            console.error('Ошибка GitHub стратегии:', err);
            return done(err, null);
        }
    }));

    // Yandex Strategy
    if (!process.env.YANDEX_CLIENT_ID || !process.env.YANDEX_CLIENT_SECRET) { //проверка .env на заполненнные поля
        throw new Error('Missing Yandex OAuth environment variables');
    }

    passport.use(new YandexStrategy({
        clientID: process.env.YANDEX_CLIENT_ID,
        clientSecret: process.env.YANDEX_CLIENT_SECRET,
        callbackURL: 'https://authorizationproject-production.up.railway.app/auth/yandex/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await findOrCreateUser(
                { yandexId: profile.id },
                {
                    username: profile.displayName,
                    yandexId: profile.id,
                    email: profile.emails && profile.emails[0] ? profile.emails[0].value : null
                }
            );
            return done(null, user);
        } catch (err) {
            console.error('Ошибка Yandex стратегии:', err);
            return done(err, null);
        }
    }));
};
