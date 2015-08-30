exports.create = function(cb) {
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost:27017/qualPro';
    var async = require('async');

    MongoClient.connect(url, function (err, db) {

        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log('connected');

        var modules = db.collection('modules');

        var _modules = [{
            _id: 1,
            mname: 'Activity list',
            href: 'activityList',
            sequence: 1,
            parrent: null,
            link: false,
            visible: true
        }, {
            _id: 2,
            mname: 'Location',
            href: 'location',
            sequence: 2,
            parrent: null,
            link: false,
            visible: true
        }, {
            _id: 3,
            mname: 'Countries',
            href: 'countries',
            sequence: 3,
            parrent: 2,
            link: true,
            visible: true
        }, {
            _id: 4,
            mname: 'Outlets',
            href: 'outlets',
            sequence: 4,
            parrent: 2,
            link: true,
            visible: true
        }, {
            _id: 5,
            mname: 'Brunches',
            href: 'brunches',
            sequence: 5,
            parrent: 2,
            link: true,
            visible: true
        }, {
            _id: 6,
            mname: 'Personnel',
            href: 'personnel',
            sequence: 6,
            parrent: null,
            link: false,
            visible: true
        }, {
            _id: 7,
            mname: 'Assignments',
            href: 'assignments',
            sequence: 7,
            parrent: null,
            link: false,
            visible: true
        }, {
            _id: 8,
            mname: 'Objectives',
            href: 'objectives',
            sequence: 8,
            parrent: 7,
            link: true,
            visible: true
        }];


        var q = async.queue(function (module, callback) {
            modules.insertOne(module, callback);
        }, 1000);

        q.drain = function () {
            cb(null, {success: true});
        };

        q.push(_modules, function () {
            console.log('finished process');
        });

    });
}
