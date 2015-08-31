// JavaScript source code
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/qualPro';
var async = require('async');

MongoClient.connect(url, function (err, db) {

    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('connected');

    var collections = ['birthdays', 'Opportunities', 'Customers', 'Department', 'Employees', 'JobPosition', 'Project', 'Salary', 'SalaryCash', 'Holiday', 'Vacation', 'wTrack', 'Invoice', 'Payment', 'MonthHours', 'bonusType', 'payOut'];

    var collection;

    async.each(collections, function (colName, cb) {
        collection = db.collection(colName);
        collection.drop(function (err, reply) {
            if (err) {
                db.close();
                return cb(err);
            }

            cb();
        });
    }, function (err) {
        db.close();
    });
});
