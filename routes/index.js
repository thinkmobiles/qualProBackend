/**
 * Created by Roman on 02.04.2015.
 */

module.exports = function (app, db) {
    var events = require('events');
    var event = new events.EventEmitter();
    var logWriter = require('../helpers/logWriter');
    var fs = require("fs");
    var multipart = require('connect-multiparty');
    var multipartMiddleware = multipart();
    var mongoose = require('mongoose');

    var csurf = require('csurf');
    var csrfProtection = csurf({ignoreMethods: ['GET']});

    var models = require("../models.js")(db);

    var PersonnelHandler = require("../handlers/personnel");
    var ModuleslHandler = require("../handlers/modules");
    // var CountryHandler=require("../handlers/country");


    var personnelHandler = new PersonnelHandler(db);
    var modulesHandler = new ModuleslHandler(db);
    //var countryHandler=new CountryHandler(db);


    var personnelRouter = require('./personnel')(db);
    var countryRouter = require('./country')(db);


    var RESPONSES = require('../constants/responses');

    function checkAuth(req, res, next) {
        if (req.session && req.session.loggedIn) {
            next();
        } else {
            res.send(401);
        }
    }

    //ToDo Use only for post methods with form
    //app.use(csrfProtection);

    app.get('/', /*csrfProtection,*/ function (req, res, next) {
        res.render('index.html'/*, {csrfToken: req.csrfToken()}*/);
    });

    app.get('/passwordChange/:forgotToken', function (req, res, next) {
        var forgotToken = req.params.forgotToken;

        res.render('changePassword.html', {
            host: process.env.HOST,
            forgotToken: forgotToken
        });
    });

    app.get('/forgotPass', function (req, res, next) {

        res.render('enterEmail.html', {
            host: process.env.HOST
        });
    });

    app.get('/modules', checkAuth, modulesHandler.getAll);
    app.post('/login', /*csrfProtection,*/ personnelHandler.login);
    app.get('/authenticated', function (req, res, next) {
        if (req.session && req.session.loggedIn) {
            res.send(200);
        } else {
            res.send(401);
        }
    });

    app.use('/personnel', personnelRouter);

    app.use('/country', countryRouter);

    function notFound(req, res, next) {
        res.status(404);


        if (req.accepts('html')) {
            return res.send(RESPONSES.PAGE_NOT_FOUND);
        }

        if (req.accepts('json')) {
            return res.json({error: RESPONSES.PAGE_NOT_FOUND});
        }

        res.type('txt');
        res.send(RESPONSES.PAGE_NOT_FOUND);

    };

    function errorHandler(err, req, res, next) {
        var status = err.status || 500;

        if (process.env.NODE_ENV === 'production') {
            if (status === 401) {
                logWriter.log('', err.message + '\n' + err.stack);
            }
            res.status(status).send({error: err.message});
        } else {
            if (status !== 401) {
                logWriter.log('', err.message + '\n' + err.stack);
            }
            res.status(status).send({error: err.message + '\n' + err.stack});
        }
    };

    app.use(notFound);
    app.use(function (err, req, res, next) {
        if (err.code !== 'EBADCSRFTOKEN') {
            return next(err);
        }
        // handle CSRF token errors here
        res.status(403);

        if (req.accepts('html')) {
            return res.send('form tampered with');
        }

        if (req.accepts('json')) {
            return res.json({error: 'form tampered with'});
        }

        res.type('txt');
        res.send('form tampered with');
    });
    app.use(errorHandler);
};