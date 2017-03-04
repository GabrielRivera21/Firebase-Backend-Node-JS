var express = require('express');
var router = express.Router();

var xmpp_client = require('../config/fcm-xmpp');

router.post('/send', function(req, res, next) {
  console.log(req.body);
  var sentResponse = xmpp_client.sendMessage(req.body);
  res.json({"sent_message": sentResponse});
});

module.exports = router;
