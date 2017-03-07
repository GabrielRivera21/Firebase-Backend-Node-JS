var express = require('express');
var router = express.Router();
var nconf = require('nconf');

var xmpp_client = require('../config/fcm-xmpp');
var send_fcm_http = require('../config/fcm-http').sendFCMNotificationMessage;

router.post('/send/xmpp', function(req, res, next) {
  console.log(req.body);
  var sentResponse = xmpp_client.sendMessage(req.body);
  res.json({"sent_message": sentResponse});
});

router.post('/send/http', function(req, res, next) {
  console.log(req.body);
  send_fcm_http(req.body).then(function(body) {
    res.json(body);
  }).catch(function(error) {
    res.status(400);
    res.json({error: error});
  });
});

module.exports = router;
