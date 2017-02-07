var express = require('express');
var passport = require('passport');

var app = new express();

require('./config/passport')(passport);
require('./config/express')(app, passport);
require('./config/routes')(app, passport);
require('./config/firdatabase')(app);

module.exports = app;
