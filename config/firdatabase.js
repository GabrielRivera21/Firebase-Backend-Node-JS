var admin = require("firebase-admin");
var serviceAccount = require("./files/serviceAccount.json");
var nconf = require('nconf');

console.log("FB_DB_URL: ", nconf.get("FIREBASE_DB_URL"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: nconf.get('FIREBASE_DB_URL')
});


module.exports = admin;
module.exports.getUser = function(uid) {
  return new Promise(function(fulfill, reject) {
    if(!uid) return reject("Please provide a uid");
    let ref = admin.database().ref("users/" + uid);
    ref.once("value", function(data) {
      return fulfill(data.val());
    });
  });
}
