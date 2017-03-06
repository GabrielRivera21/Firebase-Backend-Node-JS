var express = require('express');
var router = express.Router();

var auth = require('../config/auth');
var admin = require('../config/firdatabase');

/* GET users listing. */
router.get('/me', auth.isAuthenticated, function(req, res, next) {
  var uid = req.user_identification.uid;
  admin.getUser(uid).then(function(user) {
    return res.json(user);
  });
});

module.exports = router;
