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



    require('./routes/index')(app, db);

    return app;
};