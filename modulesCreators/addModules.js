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
        }, {
            _id: 9,
            mname: 'In-Store Reporting',
            href: 'inStorReporting',
            sequence: 9,
            parrent: 7,
            link: true,
            visible: true
        }, {
            _id: 10,
            mname: 'Custom Reports',
            href: 'customReports',
            sequence: 10,
            parrent: 7,
            link: true,
            visible: true
        }, {
            _id: 11,
            mname: 'Events',
            href: 'events',
            sequence: 11,
            parrent: null,
            link: false,
            visible: true
        }, {
            _id: 12,
            mname: 'Al Alali Reporting',
            href: 'alalaliReporting',
            sequence: 12,
            parrent: 11,
            link: true,
            visible: true
        }, {
            _id: 13,
            mname: 'Competitor Activity',
            href: 'competitorActivity',
            sequence: 13,
            parrent: 11,
            link: true,
            visible: true
        }, {
            _id: 14,
            mname: 'Competitor List',
            href: 'competitorList',
            sequence: 14,
            parrent: 11,
            link: true,
            visible: true
        }, {
            _id: 15,
            mname: 'Shelf & Planogram',
            href: 'planogram',
            sequence: 15,
            parrent: null,
            link: false,
            visible: true
        }, {
            _id: 16,
            mname: 'Shelf Shares',
            href: 'shelfShares',
            sequence: 16,
            parrent: 15,
            link: true,
            visible: true
        }, {
            _id: 17,
            mname: 'Competitor Activity',
            href: 'competitorActivity',
            sequence: 17,
            parrent: 15,
            link: true,
            visible: true
        }, {
            _id: 18,
            mname: 'Items',
            href: 'items',
            sequence: 18,
            parrent: null,
            link: false,
            visible: true
        }, {
            _id: 19,
            mname: 'Items List',
            href: 'itemsList',
            sequence: 19,
            parrent: 18,
            link: true,
            visible: true
        }, {
            _id: 20,
            mname: 'Price List',
            href: 'priceList',
            sequence: 17,
            parrent: 20,
            link: true,
            visible: true
        }, {
            _id: 21,
            mname: 'Contract',
            href: 'contracts',
            sequence: 21,
            parrent: null,
            link: false,
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
};
