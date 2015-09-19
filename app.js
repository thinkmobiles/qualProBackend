/**
 * Created by Roman on 01.04.2015.
 */

module.exports = function (db) {
    var http = require('http');
    var path = require('path');
    var fs = require("fs");
    var express = require('express');
    var Session = require('express-session');
    var session;
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var consolidate = require('consolidate');
    var mongoose = require('mongoose');

    var app = express();

    var logWriter = require('./helpers/logWriter');

    var MemoryStore = require('connect-mongo')(Session);

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

    session = Session({
        name: 'qualPro_main',
        key: "qualPro_main",
        secret: 'gE7FkGtEdF32d4f6h8j0jge4547hTThGFyJHPkJkjkGH7JUUIkj0HKh',
        resave: false,

        cookie: {
            maxAge: 365 * 24 * 60 * 60 * 1000 // One year
        },

        saveUninitialized: true,
        store: new MemoryStore(sessionConfig)
    });

    app.use(session);

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

    require('./routes/index')(app, db);

    return app;
};