var nconf = require('nconf');
var request = require("request");

var ServerKey = nconf.get('FCM_SERVER_KEY');

var sendFCMNotificationMessage = function (payload) {
  return new Promise(function(fulfill, reject) {
    var options = {
      url: 'https://fcm.googleapis.com/fcm/send',
      headers: {
        'Authorization': `key=${ServerKey}`
      },
      json: payload
    };
    request.post(options, function (error, response, body) {
        console.log("FCM Response: ");
        console.log(body);
        if (!error && response.statusCode >= 200 && response.statusCode <= 299) {
          return fulfill(body);
        } else {
          return reject(error);
        }
    });
  });
};

module.exports.sendFCMNotificationMessage = sendFCMNotificationMessage;
