/**
 * Created by micha on 8/31/2015.
 */
var mongoose = require('mongoose');

var Country = function (db) {
    //var _ = require('../node_modules/underscore');
    //var CONSTANTS = require('../constants/mainConstants');

    var schema = mongoose.Schemas['country'];
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
        var CreateModel = db.model('country', schema);
        var model;
      //  var error;

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
        var error;
        var CreateModel = db.model('country', schema);
        var query;

        if (req.session.uId === id) {
            error = new Error();
            error.status(400);
            return next(error);
        }

        query = CreateModel.remove({_id: id});
        query.exec(sendErrorOrSuccessCallback(res, next));
    };

    this.getById = function (req, res, next) {
        var id = req.params.id;

        var query = db.model('country', schema).findById(id);
        query.exec(function (err,model) {
            sendErrorOrSuccessCallback(res, next, err, model)
        });
    };

    this.getAll = function (req, res, next) {
      //  var error;
        var Model = db.model('country', schema);
        Model.find().

            exec(function (err, dbObjects) {
                sendErrorOrSuccessCallback(res, next, err, dbObjects);
            });
    }
};
module.exports = Country;