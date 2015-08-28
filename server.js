var mongoose = require('mongoose');
//var mainAppConfig = require('./config/main').mainApp;
var db;
var app;
var env = process.env;
var connectOptions;

env.NODE_ENV = 'development';

connectOptions = require('./config/' + env.NODE_ENV).mongoConfig;

db = mongoose.createConnection(env.DB_HOST, env.DB_NAME, env.DB_PORT, connectOptions);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    var port = process.env.PORT || 8089;

    console.log("Connected to db is success");

    require('./models/index.js');

    app = require('./app')(db);

    app.listen(port, function () {
        console.log('==============================================================');
        console.log('|| server start success on port=' + port + ' in ' + env.NODE_ENV + ' version ||');
        console.log('==============================================================\n');
    });
});
