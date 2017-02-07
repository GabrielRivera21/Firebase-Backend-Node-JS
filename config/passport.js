var local = require('./passport/local');
var Models = require('../models');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(function (user, done) {
        Models.users.findOne({ where: { uid: user.uid } }).then(function (userInstance) {
            done(null, user.email);
        }).catch(function (err) {
            done(err);
        });
    });

    // use these strategies
    passport.use(local);
}

module.exports.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.loggedIn = (req.user) ? true : false;
        return next();
    }
    res.redirect('/login');
}

module.exports.isNotAuthenticated = function (req, res, next) {
    if (!req.isAuthenticated())
        return next();
    res.redirect('/');
}
