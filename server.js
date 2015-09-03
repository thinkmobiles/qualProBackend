var mongoose = require('mongoose');
var db;
var app;
var env = process.env;
var connectOptions;

env.NODE_ENV = 'development';

connectOptions = require('./config/' + env.NODE_ENV).mongoConfig;

function drawServerStart(port) {
    console.log('==============================================================');
    console.log('|| server start success on port=' + port + ' in ' + env.NODE_ENV + ' version ||');
    console.log('==============================================================\n');
}

function drawServerStartCool() {
    console.log("  _________                                           __                 __             .___");
    console.log(" /   _____/ ______________  __ ___________    _______/  |______ ________/  |_  ____   __| _/");
    console.log(" \\_____  \\_/ __ \\_  __ \\  \\/ // __ \\_  __ \\  /  ___/\\   __\\__  \\\\_  __ \\   __\\/ __ \\ / __ | ");
    console.log(" /        \\  ___/|  | \\/\\   /\\  ___/|  | \\/  \\___ \\  |  |  / __ \\|  | \\/|  | \\  ___// /_/ | ");
    console.log("/_______  /\\___  >__|    \\_/  \\___  >__|    /____  > |__| (____  /__|   |__|  \\___  >____ | ");
    console.log("        \\/     \\/                 \\/             \\/            \\/                 \\/     \\/ ");

}


db = mongoose.createConnection(env.DB_HOST, env.DB_NAME, env.DB_PORT, connectOptions);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    var port = process.env.PORT || 8089;

    console.log("Connected to db is success");

    require('./models/index.js');

    if (env.NODE_ENV === 'development') {
        require('./config/' + env.NODE_ENV).createAdmin(db);
    }

    app = require('./app')(db);

    app.listen(port, function () {

        drawServerStart(port);
        drawServerStartCool();
    });




});
