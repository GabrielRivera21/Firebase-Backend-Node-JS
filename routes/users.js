var express = require('express');
var router = express.Router();

var auth = require('../config/auth');
var admin = require('../config/firdatabase');

/* GET users listing. */
router.get('/me', auth.isAuthenticated, function(req, res, next) {
  var user = req.user_identification;
  var ref = admin.database().ref("users/" + user.uid);
  ref.once("value", function(data) {
    return res.json(data.val());
  });
});

module.exports = router;
