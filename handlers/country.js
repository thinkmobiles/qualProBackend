/**
 * Created by micha on 8/31/2015.
 */
var mongoose = require('mongoose');

var Country = function (db) {
    //var _ = require('../node_modules/underscore');
    var CONSTANTS = require('../constants/mainConstants');

    var schema = mongoose.Schemas[CONSTANTS.COUNTRY];
    // var access = require('../helpers/access');

    //  var mid;

    var sendErrorOrSuccessCallback = function (response, next, error, result) {
        if (error) {
            return next(error);
        }
        response.status(200).send(result);

    };

    this.create = function (req, res, next) {
        var body = req.body;
        var CreateModel = db.model(CONSTANTS.COUNTRY, schema);
        var model;


        var modelIsValid = true;
        //todo validation


        if (modelIsValid) {
            model = CreateModel(body);
            model.save(function (error, model) {
                if (error) {
                    return next(error);
                }
                res.status(200).send(model)
            })
        } else {
            res.status(400).send();
        }

    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var Model = db.model(CONSTANTS.COUNTRY, schema);

        Model.findByIdAndRemove(id, function (error) {
            if (error) {
                return next(error);
            }
            res.status(200).send();
        });
    };

    this.getById = function (req, res, next) {
        var id = req.params.id;

        var query = db.model(CONSTANTS.COUNTRY, schema).findById(id);
        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.getAll = function (req, res, next) {
        //  var error;
        var Model = db.model(CONSTANTS.COUNTRY, schema);
        Model.find().

            exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(result);
            });
    };

    this.update = function (req, res, next) {
        var id = req.params.id;
        var Model = db.model(CONSTANTS.COUNTRY, schema);
        var body = req.body;

        Model.findByIdAndUpdate(id, body, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };
};
module.exports = Country;