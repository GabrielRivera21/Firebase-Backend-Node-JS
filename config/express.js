var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var nconf = require('nconf');

var xmpp_client = require('./fcm-xmpp');

module.exports = function (app, passport) {
    nconf.env().file({ file: __dirname + "/config.json" });

    // view engine setup__dirname + '/../config/config.json'
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'jade');

    // uncomment after placing your favicon in /public
    //app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(require('stylus').middleware(path.join(__dirname, '../public')));
    app.use(express.static(path.join(__dirname, '../public')));

    app.use(session({
        resave: false,
        saveUninitialized: true,
        secret: nconf.get('SECRET_KEY'),
        cookie: {
            maxAge : 1000 * 60 * 60 * 24
        }
    }));

    // Initialize passport
    app.use(passport.initialize());
    app.use(passport.session());
}
