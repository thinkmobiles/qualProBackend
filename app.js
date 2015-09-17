/**
 * Created by Roman on 01.04.2015.
 */

module.exports = function (db) {
    var http = require('http');
    var path = require('path');
    var fs = require("fs");
    var express = require('express');
    var session = require('express-session');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var consolidate = require('consolidate');
    var mongoose = require('mongoose');

    var app = express();

    var logWriter = require('./helpers/logWriter');

    var MemoryStore = require('connect-mongo')(session);

    var sessionConfig = require('./config/' + process.env.NODE_ENV).sessionConfig;

    var allowCrossDomain = function (req, res, next) {

        var allowedHost = [
            '185.2.100.192:8088',
            'localhost:8088',
            '192.168.88.13:8088'
        ];
        var browser = req.headers['user-agent'];

        if (/Trident/.test(browser)) {
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        }

        next();
    };

    app.engine('html', consolidate.swig);

    app.set('view engine', 'html');
    app.set('views', __dirname + '/views');

    app.use(logger('dev'));
    app.use(bodyParser.json({strict: false, inflate: false, limit: 1024 * 1024 * 200}));
    app.use(bodyParser.urlencoded({extended: false, limit: 1024 * 1024 * 200}));
    app.use(cookieParser("CRMkey"));
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(allowCrossDomain);

    app.use(session({
        name: 'qualPro_main',
        key: "qualPro_main",
        secret: 'gE7FkGtEdF32d4f6h8j0jge4547hTThGFyJHPkJkjkGH7JUUIkj0HKh',
        resave: false,
        saveUninitialized: false,
        store: new MemoryStore(sessionConfig)
    }));

    Array.prototype.objectID = function () {
        var _arrayOfID = [];
        var objectId = mongoose.Types.ObjectId;

        for (var i = 0; i < this.length; i++) {
            if (this[i] && typeof this[i] == 'object' && this[i].hasOwnProperty('_id')) {
                _arrayOfID.push(this[i]._id);
            } else {
                if (typeof this[i] == 'string' && this[i].length === 24) {
                    _arrayOfID.push(objectId(this[i]));
                }
                if (this[i] === null || this[i] === 'null') {
                    _arrayOfID.push(null);
                }

            }
        }
        return _arrayOfID;
    };

    event.on('createdChild', function (id, targetModel, searchField, fieldName, fieldValue, fieldInArray) {
        //fieldInArray(bool) added for update values in array. If true then fieldName contains .$.
        var serchObject = {};
        var updateObject = {};

        serchObject[searchField] = id;

        if (fieldInArray) {
            updateObject['$set'] = {};
            updateObject['$set'][fieldName] = fieldValue;
        } else {
            updateObject[fieldName] = fieldValue;
        }

        targetModel.update(sercObject, updateObject, {multi: true}, function(err){
            if(err){
                logWriter.log('requestHandler_eventEmiter_updateName', err.message);
            }
        });
    });

    require('./routes/index')(app, db);

    return app;
};