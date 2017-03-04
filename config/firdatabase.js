var admin = require("firebase-admin");
var serviceAccount = require("./files/serviceAccount.json");
var nconf = require('nconf');

console.log("FB_DB_URL: ", nconf.get("FIREBASE_DB_URL"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: nconf.get('FIREBASE_DB_URL')
});


module.exports = admin;
