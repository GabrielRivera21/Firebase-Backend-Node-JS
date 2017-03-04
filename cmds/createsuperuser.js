var nconf = require('nconf');
nconf.env().file({ file: __dirname + '/../config/config.json' });

var admin = require('../config/firdatabase');

var readlineSync = require('readline-sync');

module.exports = function () {
    var user = {
      emailVerified: false,
      disabled: false
    };

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

    user.password = password;

    admin.auth().createUser(user).then(function(userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Created User in Authentication, now storing in Realtime Database...");
      user.is_admin = true;
      var db = admin.database();
      var newUserRef = db.ref("users/" + userRecord.uid);
      newUserRef.set(user, function(error) {
        if(error) {
          console.err("Data could not be saved." + error);
        } else {
          console.log("Successfully created new user:", userRecord.uid);
        }
        process.exit();
      });
    }).catch(function(error) {
      console.log("Error creating new user:", error);
      process.exit();
    });
};
