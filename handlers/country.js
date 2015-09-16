var mongoose = require('mongoose');

var Country = function (db) {

    var CONSTANTS = require('../constants/mainConstants');
    var modelAndSchemaName = CONSTANTS.COUNTRY;
    var schema = mongoose.Schemas[modelAndSchemaName];
    var Model = db.model(modelAndSchemaName, schema);

    this.create = function (req, res, next) {
        var body = req.body;
        var model;
        var error;

        var modelIsValid = true;
        //todo validation

        if (!modelIsValid) {
            error = new Error();
            error.status = 400;

            return next(error);
        }

        model = Model(body);
        model.save(function (error, model) {
            if (error) {
                return next(error);
            }
            res.status(201).send(model)
        })


    };

    this.remove = function (req, res, next) {
        var id = req.params.id;

        Model.findByIdAndRemove(id, function (error) {
            if (error) {
                return next(error);
            }
            res.status(200).send();
        });
    };

    this.getBy = function (req, res, next) {
        var outlets = req.body.outlets;

        var query = db.model(modelAndSchemaName, schema).find(
            {outlets: {$elemMatch: {$in: outlets}}});

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.getById = function (req, res, next) {
        var id = req.params.id;

        var query = db.model(modelAndSchemaName, schema).findById(id);
        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.getForDD = function (req, res, next) {
        Model.find({}, '_id name').

            exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(result);
            });
    };

    this.getAll = function (req, res, next) {
        var query = req.query;
        var page = query.page || 1;
        var limit = query.count || parseInt(CONSTANTS.LIST_COUNT);
        var skip = (page - 1) * limit;
        var queryObject = {};

        var parallelTasks;

        function contentFinder(parallelCb) {
            Model.find(queryObject)
                .skip(skip)
                .limit(limit)
                .exec(function (err, result) {
                    if (err) {
                        return parallelCb(err);
                    }
                    parallelCb(null, result);
                });
        };

        function totalCounter(parallelCb) {
            Model.count(queryObject, function (err, result) {
                if (err) {
                    return parallelCb(err);
                }
                parallelCb(null, result);
            });
        };

        parallelTasks = {
            total: totalCounter,
            data: contentFinder
        };

        async.parallel(parallelTasks, function (err, response) {
            if (err) {
                return next(err);
            }

            res.status(200).send(response);
        });
    };

    this.update = function (req, res, next) {
        var id = req.params.id;
        var body = req.body;

        Model.findByIdAndUpdate(id, body, {new: true}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };
};
module.exports = Country;