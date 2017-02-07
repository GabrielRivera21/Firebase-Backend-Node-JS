var express = require('express');
var router = express.Router();

var xmpp_client = require('../config/fcm-xmpp');
var fcm_utils = require('../utils/fcm-utils');

router.post('/send', function(req, res, next) {
  console.log(req.body);
  var sentResponse = fcm_utils.sendMessage(xmpp_client, req.body);
  res.json({"sent_message": sentResponse});
});

module.exports = router;
