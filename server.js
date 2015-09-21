var mongoose = require('mongoose');
var fs = require('fs');
var db;
var app;
var env = process.env;
var connectOptions;
var https = require('https');
var httpsServer;

var httpsOptions = {
    key:    fs.readFileSync('./config/ssl/server.key'),
    cert:   fs.readFileSync('./config/ssl/server.crt'),
    ca:     fs.readFileSync('./config/ssl/ca.crt'),
    passphrase: '2158',
    requestCert:        true,
    rejectUnauthorized: false
};

env.NODE_ENV = 'development';

connectOptions = require('./config/' + env.NODE_ENV).mongoConfig;

db = mongoose.createConnection(env.DB_HOST, env.DB_NAME, env.DB_PORT, connectOptions);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    var port = process.env.PORT || 443;

    console.log("Connected to db is success");

    require('./models/index.js');

    if (env.NODE_ENV === 'development') {
        require('./config/' + env.NODE_ENV).createAdmin(db);
        require('./modulesCreators/addPersonnelsForTest').createUsers(db);
    }

    app = require('./app')(db);

    httpsServer = https.createServer(httpsOptions, app);

    /*httpsServer.listen(port, function () {*/
    app.listen(port, function () {
        console.log('==============================================================');
        console.log('|| server start success on port=' + port + ' in ' + env.NODE_ENV + ' version ||');
        console.log('==============================================================\n');
    });
});
