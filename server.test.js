var mongoose = require('mongoose');
var db;
var app;
var env = process.env;
var connectOptions;

var configTest = require('./config/test');
env.NODE_ENV = 'test';

connectOptions = configTest.mongoConfig;

db = mongoose.createConnection(env.DB_HOST, env.DB_NAME, env.DB_PORT, connectOptions);
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback() {
    var port = 8099;

    console.log("Connected to db is success");

    require('./models/index.js');
    for (var collection in mongoose.connection.collections) {
        mongoose.connection.collections[collection].drop();
    }

  var dbInitialSetup=require('../mo')


    app = require('./app')(db);

    app.listen(port, function () {
        console.log(env.DB_HOST);
        console.log('==============================================================');
        console.log('|| server start success on port=' + port + ' in ' + env.NODE_ENV + ' version ||');
        console.log('==============================================================\n');

    });
});