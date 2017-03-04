var express = require('express');
var router = express.Router();

var auth = require('../config/auth');

/* GET users listing. */
router.get('/me', auth.isAuthenticated, function(req, res, next) {
  res.json(req.user);
});

module.exports = router;
