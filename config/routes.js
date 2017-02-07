var index = require('../routes/index');
var users = require('../routes/users');
var fcm = require('../routes/fcm');
var isNotAuthenticated = require('./passport').isNotAuthenticated;

module.exports = function (app, passport) {
    app.post('/login', passport.authenticate('local'), function (req, res) {
        req.session.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect('/login');
            }
            return res.redirect('/');
        });
    });

    app.get('/login', isNotAuthenticated, function (req, res) {
        res.render('account/login');
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // setting routers
    app.use('/', index);
    app.use('/api/users', users);
    app.use('/api/fcm', fcm);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        res.locals.loggedIn = (req.user) ? true : false;
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.locals.loggedIn = (req.user) ? true : false;
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.locals.loggedIn = (req.user) ? true : false;
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}
