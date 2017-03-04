var express = require('express');

var app = new express();

require('./config/express')(app); // configure express framework and env file.
require('./config/routes')(app); // configure routes.
require('./config/firdatabase'); // initialize admin SDK.
require('./config/fcm-xmpp'); // construct xmpp client.

module.exports = app;
