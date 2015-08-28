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
    var models = require("../models.js")(db);
    var PersonnelHandler = require("../handlers/personnel");
    var personnelHandler = new PersonnelHandler(db);

    var personnelRouter = require('./personnel')(models);

    var RESPONSES = require('../constants/responses');

    function checkAuth(req, res, next) {
        if (req.session && req.session.loggedIn) {
            res.send(200);
        } else {
            res.send(401);
        }
    }

    app.use('/personnel', personnelRouter);

    /*app.get('/', function (req, res, next) {
        res.sendfile('index.html');
    });*/

    app.post('/login', personnelHandler.login);

    app.get('/authenticated', checkAuth);

    /*app.get('/getModules', function (req, res) {
        requestHandler.getModules(req, res);
    });*/
};