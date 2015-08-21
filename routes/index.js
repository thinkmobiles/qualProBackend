/**
 * Created by Roman on 02.04.2015.
 */

module.exports = function (app, mainDb) {
    var events = require('events');
    var event = new events.EventEmitter();
    var logWriter = require('../helpers/logWriter');
    var RESPONSES = require('../constants/responses');
    var fs = require("fs");
    var multipart = require('connect-multiparty');
    var multipartMiddleware = multipart();
    var mongoose = mainDb.mongoose;
    var dbsNames = app.get('dbsNames');
    var dbsObject = mainDb.dbsObject;

    app.get('/', function (req, res, next) {
        res.sendfile('index.html');
    });

    app.get('/', function (req, res) {
        res.sendfile('index.html');
    });

    app.get('/getDBS', function (req, res) {
        res.send(200, {dbsNames: dbsNames});
    });

    app.get('/currentDb', function (req, res, next) {
        if (req.session && req.session.lastDb) {
            res.status(200).send(req.session.lastDb);
        } else {
            res.status(401).send();
        }
    });

    app.get('/account/authenticated', function (req, res, next) {
        if (req.session && req.session.loggedIn) {
            res.send(200);
        } else {
            res.send(401);
        }
    });

    app.get('/getModules', function (req, res) {
        requestHandler.getModules(req, res);
    });
};