/*Just for test*/
var mongoose = require('mongoose');
var mainAppConfig = require('./config/main').mainApp;
var dbOptions = {
    "_id": 1,
    "url": "localhost",
    "DBname": "qualPro",
    "user": "",
    "pass": ""
};

var mainDb = mongoose.createConnection('localhost', 'mainDB');
var app;

require('./config/' + mainAppConfig.NODE_ENV);
process.env.NODE_ENV = mainAppConfig.NODE_ENV;
mainDb.on('error', console.error.bind(console, 'connection error:'));
mainDb.once('open', function callback() {
    var port = process.env.PORT || 8089;

    console.log("Connection to mainDB is success");

    require('./models/index.js');

    mainDb.mongoose = mongoose;

    app = require('./app')(mainDb, dbOptions);

    app.listen(port, function () {
        console.log('==============================================================');
        console.log('|| server start success on port=' + port + ' in ' + process.env.NODE_ENV + ' version ||');
        console.log('==============================================================\n');
    });
});
