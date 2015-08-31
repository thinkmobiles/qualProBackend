
process.env.DB_HOST = 'localhost';

process.env.HOST = 'http://localhost:9797';
process.env.PORT = 9797;
//process.env.DB_USER = "user";
//process.env.DB_PASS = "1q2w3e!@#";
process.env.DB_NAME = "qualPro";
process.env.DB_PORT = 27017;

exports.mongoConfig = {
    db: {
        native_parser: false
    },
    server: { poolSize: 5 },
    //replset: { rs_name: 'myReplicaSetName' },
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    w: 1,
    j: true,
    mongos: false
};

exports.sessionConfig = {
    db: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    resave: false,
    saveUninitialized: false,
    reapInterval: 500000
};

/*REMOVE*/
/*-----------------------------------------*/
/*Creating admin personnel only for tests
 * should be removed in production*/

this.createAdmin = function (db) {

    var mongoose = require('mongoose');
    var personnelSchema = mongoose.Schemas['personnel'];
    var crypto = require('crypto');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var adminObject = {
        email: 'admin@admin.com',
        pass: '121212',
        firstName: 'Vasya',
        lastName: 'Pupkin',
        position: ObjectId('0'),
        description: 'Super Admin created auto'
    }

    var shaSum = crypto.createHash('sha256');
    var PersonnelModel = db.model('personnels', personnelSchema);
    var personnelModel;

    shaSum.update(adminObject.pass);
    adminObject.pass = shaSum.digest('hex');

    PersonnelModel.findOne({email: adminObject.email}, function (err, result) {
        if (err) {
            return console.log(err);
        }

        if (!result) {
            personnelModel = new PersonnelModel(adminObject);
            personnelModel.save(function (err, personnel) {
                if (err) {
                    return console.log(err);
                }

                console.log('--- Admin created ---');
            })
        } else {
            console.log('--- Admin already exists ---');
        }
    })
}

/*-----------------------------------------*/