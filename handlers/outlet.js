var mongoose = require('mongoose');

var Outlet = function (db, event) {

    var CONSTANTS = require('../constants/mainConstants');
    var modelAndSchemaName = CONSTANTS.OUTLET;
    var schema = mongoose.Schemas[modelAndSchemaName];
    var Model = db.model(modelAndSchemaName, schema);

    this.create = function (req, res, next) {
        var body = req.body;
        var outletId;
        var model;
        var countryId;
        var Country = db.model(CONSTANTS.COUNTRY, mongoose.Schemas[CONSTANTS.COUNTRY]);

        var modelIsValid = !!body.country;
        //todo validation

        if (modelIsValid) {
            model = Model(body);
            model.save(function (error, result) {
                var options;

                if (error) {
                    return next(error);
                }
                outletId = result._id;
                countryId = result.country;

                options = {
                    id         : countryId,
                    targetModel: Country,
                    fieldName  : '_id',
                    fieldValue : outletId,
                    searchField: 'outlets',
                    isArray    : true
                };

                event.emit('createdChild', options);

                res.status(201).send(model);
            });
        }
        else {
            res.status(400).send();
        }
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

    this.getById = function (req, res, next) {
        var id = req.params.id;

        var query = Model.findById(id);
        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.archive = function (req, res, next) {
        var id = req.params.id;
        res.status(501).send();
    };

    this.getBy = function (req, res, next) {
        var branches = req.body.branches;

        var query = Model.find(
            {branches: {$elemMatch: {$in: branches}}});

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.getForDD = function (req, res, next) {
        Model.find({}, '_id name')
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(result);
            });
    };

    this.getAll = function (req, res, next) {
        Model.find({})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(result);
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
module.exports = Outlet;
