const GitHubStrategy = require('passport-github').Strategy;
const YandexStrategy = require('passport-yandex').Strategy;
const User = require('../models/User');

async function findOrCreateUser(query, userData) {
    let user = await User.findOne(query);
    if (!user) {
        user = await User.create(userData);
    }
    return user;
}

module.exports = (passport) => {
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user));
    });

    // GitHub Strategy
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
        throw new Error('Missing GitHub OAuth environment variables');
    }

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'https://your-api-endpoint.com/auth/github/callback'
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
    if (!process.env.YANDEX_CLIENT_ID || !process.env.YANDEX_CLIENT_SECRET) {
        throw new Error('Missing Yandex OAuth environment variables');
    }

    passport.use(new YandexStrategy({
        clientID: process.env.YANDEX_CLIENT_ID,
        clientSecret: process.env.YANDEX_CLIENT_SECRET,
        callbackURL: 'https://your-api-endpoint.com/auth/yandex/callback'
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
