function start(done) {

    var mongoose = require('mongoose');
    var db;
    var app;
    var env = process.env;
    var connectOptions;

    env.NODE_ENV = 'test';

    connectOptions = require('../../config/development').mongoConfig;

    db = mongoose.createConnection(env.DB_HOST, "qualPro_test", env.DB_PORT, connectOptions);
    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', function callback() {
        var port =  8099;

        console.log("Connected to db is success");

        require('../../models/index.js');


        require('../../config/development').createAdmin(db);


        app = require('../../app')(db);

        app.listen(port, function () {
            console.log(env.DB_HOST);
            console.log('==============================================================');
            console.log('|| server start success on port=' + port + ' in ' + env.NODE_ENV + ' version ||');
            console.log('==============================================================\n');
            done();
        });
    });
}
module.exports = start;