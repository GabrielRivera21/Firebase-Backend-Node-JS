var LocalStrategy = require('passport-local').Strategy;
var Models = require('../../models');
var bcrypt = require('bcrypt');

module.exports = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, done) {
        Models.users.findOne({ where: { email: email } }).then(function (userInstance) {
            var user = userInstance.toJSON();
            if (user == null || user == undefined)
                return done(null, false);
            if (!bcrypt.compareSync(password, user.password))
                return done(null, false);

            return done(null, user);
        }).catch(function (error) {
            console.log(error);
            return done(error.message);
        });
    }
);
