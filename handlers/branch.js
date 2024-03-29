var mongoose = require('mongoose');

var Branch = function (db) {

    var CONSTANTS = require('../constants/mainConstants');
    var modelAndSchemaName = CONSTANTS.BRANCH;
    var schema = mongoose.Schemas[modelAndSchemaName];

    this.create = function (req, res, next) {
        var body = req.body;
        var Model = db.model(modelAndSchemaName, schema);
        var model;

        var modelIsValid = true;
        //todo validation

        if (modelIsValid) {
            model = Model(body);
            model.save(function (error, model) {
                var Outlet = db.model(CONSTANTS.OUTLET, mongoose.Schemas[CONSTANTS.OUTLET]);

                if (error) {
                    return next(error);
                }

                Outlet.findByIdAndUpdate(model.outlet, {$addToSet: {branches: model._id}}, function (error) {
                    if (error) {
                        //todo remove outlet
                        return next(error);
                    }
                    res.status(201).send(model);
                });
            });
        } else {
            res.status(400).send();
        }

    };

    this.remove = function (req, res, next) {
        //var id = req.params.id;
        //var Model = db.model(modelAndSchemaName, schema);

        //var Archiver = require('../helpers/archiver');
        //var archiver = Archiver();
        //archiver.archive(Model, id, function (error) {
        //    if (error) {
        //        return next(error);
        //    }
        //    res.status(200).send();
        //});

        //Model.findByIdAndRemove(id, function (error) {
        //    if (error) {
        //        return next(error);
        //    }
        //    res.status(200).send();
        //});
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
        var Model = db.model(modelAndSchemaName, schema);
        Model.find({}, '_id name').

            exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(result);
            });
    };

    this.getAll = function (req, res, next) {
        //  var error;
        var Model = db.model(modelAndSchemaName, schema);

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
        var Model = db.model(modelAndSchemaName, schema);
        var body = req.body;

        Model.findByIdAndUpdate(id, body, {new: true}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };
};
module.exports = Branch;
