var CONSTANTS = require('../constants/mainConstants');

exports.create = function (cb) {
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
            mname: 'Countries',
            href: 'countries',
            sequence: 2,
            parrent: null,
            link: false,
            visible: true
        }, {
            _id: 3,
            mname: 'Outlets',
            href: 'outlets',
            sequence: 3,
            parrent: 2,
            link: true,
            visible: true
        }, {
            _id: 4,
            mname: 'Branches',
            href: 'branches',
            sequence: 4,
            parrent: 2,
            link: true,
            visible: true
        }, {
            _id: 5,
            mname: 'Personnel',
            href: CONSTANTS.PERSONNEL,
            sequence: 5,
            parrent: null,
            link: false,
            visible: true
        }, {
            _id: 6,
            mname: 'Objectives',
            href: 'objectives',
            sequence: 6,
            parrent: null,
            link: false,
            visible: true
        }, {
            _id: 7,
            mname: 'In-Store Reporting',
            href: 'inStorReporting',
            sequence: 7,
            parrent: null,
            link: false,
            visible: true
        }, {
            _id: 8,
            mname: 'Al Alali Reporting',
            href: 'alalaliReporting',
            sequence: 8,
            parrent: null,
            link: false,
            visible: true
        }, {
            _id: 9,
            mname: 'Shelf Shares & Planograms',
            href: 'planogram',
            sequence: 9,
            parrent: null,
            link: false,
            visible: true
        }, {
            _id: 10,
            mname: 'Shelf Shares',
            href: 'shelfShares',
            sequence: 10,
            parrent: 9,
            link: true,
            visible: true
        }, {
            _id: 11,
            mname: 'Shelf Planograms',
            href: 'shelfPlanograms',
            sequence: 11,
            parrent: 9,
            link: true,
            visible: true
        }, {
            _id: 12,
            mname: 'Items & Prices',
            href: 'items',
            sequence: 12,
            parrent: null,
            link: false,
            visible: true
        }, {
            _id: 13,
            mname: 'Items List',
            href: 'itemsList',
            sequence: 13,
            parrent: 12,
            link: true,
            visible: true
        }, {
            _id: 14,
            mname: 'Price List',
            href: 'priceList',
            sequence: 14,
            parrent: 12,
            link: true,
            visible: true
        },{
            _id: 15,
            mname: 'Price Surveys',
            href: 'priceSurveys',
            sequence: 15,
            parrent: 12,
            link: true,
            visible: true
        }, {
            _id: 16,
            mname: 'Competitors',
            href: 'competitors',
            sequence: 16,
            parrent: null,
            link: false,
            visible: true
        }, {
            _id: 17,
            mname: 'Competitors List',
            href: 'competitorsList',
            sequence: 17,
            parrent: 16,
            link: true,
            visible: true
        }, {
            _id: 18,
            mname: 'Competitors Activity',
            href: 'competitorsActivity',
            sequence: 18,
            parrent: 16,
            link: true,
            visible: true
        }, {
            _id: 19,
            mname: 'Contract',
            href: 'contracts',
            sequence: 19,
            parrent: null,
            link: false,
            visible: true
        }, {
            _id: 20,
            mname: 'Custom Reports',
            href: 'customReports',
            sequence: 20,
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
