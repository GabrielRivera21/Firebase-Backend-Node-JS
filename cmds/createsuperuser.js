var Models = require('../models');
var bcrypt = require('bcrypt');
const uuidV4 = require('uuid/v4');

var readlineSync = require('readline-sync');

module.exports = function () {
    var user = {};

    user.uid = uuidV4();
    user.email = readlineSync.questionEMail('Please enter an Email:\n');
    user.displayName = readlineSync.question("Please enter the Display Name:\n");

    var isSamePassword = false;
    while (!isSamePassword) {
        var password = readlineSync.question("Enter Password:\n", { hideEchoBack: true, keepWhitespace: true });
        var confirmPassword = readlineSync.question("Confirm Password:\n", { hideEchoBack: true, keepWhitespace: true });
        if (password !== confirmPassword) {
            console.log("Sorry passwords did not match, try again");
        } else {
            isSamePassword = true;
        }
    }
    var salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(password, salt);

    Models.users.create(user).then(function (userinstance) {
        console.log("user has been successfully created.");
        process.exit();
    }).catch(function (err) {
        console.log(err);
        process.exit();
    });
};
