var mongoose = require('mongoose');
var CONSTANTS = require('../constants/mainConstants');

var Personnel = function (db) {
    //var _ = require('underscore');
    var crypto = require('crypto');
    var access = require('../helpers/access');
    var generator = require('../helpers/randomPass.js');
    var CONSTANTS = require('../constants/mainConstants');
    //var RESPONSES = require('../constants/responses');
    var Mailer = require('../helpers/mailer');
    var async = require('async');
    var personnelSchema = mongoose.Schemas[CONSTANTS.PERSONNEL];
    var PersonnelModel = db.model(CONSTANTS.PERSONNEL, personnelSchema);
    //var mid;

    this.create = function (req, res, next) {
        var body = req.body;
        var email = body.email;
        var isEmailValid;
        var pass = generator.generate(8);
        var mailer = new Mailer();
        var shaSum = crypto.createHash('sha256');
        var personnelModel;
        var token = generator.generate();
        var error;

        isEmailValid = CONSTANTS.EMAIL_REGEXP.test(email);
        shaSum.update(pass);
        body.pass = shaSum.digest('hex');
        body.token=token;

        if (!isEmailValid) {
            error = new Error();
            error.status(400);
            return next(error);
        }

        personnelModel = new PersonnelModel(body);
        personnelModel.save(function (err, personnel) {
            if (err) {
                return next(err);
            }
            mailer.confirmNewUserRegistration(
                {
                    firstName: personnel.firstName,
                    lastName: personnel.lastName,
                    email: personnel.email,
                    password: personnel.pass,
                    token:personnel.token
                });
           // delete personnel.pass;
            res.status(200).send({_id:personnel._id});

        });
        /*});*/
    };

    this.login = function (req, res, next) {
        var session = req.session;
        var body = req.body;
        var email = body.email;
        var pass = body.pass;
        var shaSum = crypto.createHash('sha256');
        var query;

        var lastAccess;
        var resultPersonnel;
        var error;

        shaSum.update(pass);

        if (!email || !pass) {
            error = new Error();
            error.status(400);
            return next(error);
        }

        query = PersonnelModel.findOne({
            email: email
        });
        query.exec(function (err, personnel) {
            if (err) {
                return next(err);
            }

            if (!personnel || personnel.pass !== shaSum.digest('hex')) {
                error = new Error();
                error.status(400);

                return next(error);
            }


            session.loggedIn = true;
            session.uId = personnel._id;
            session.uName = personnel.login;
            lastAccess = new Date();
            session.lastAccess = lastAccess;

            PersonnelModel.findByIdAndUpdate(personnel._id, {$set: {lastAccess: lastAccess}}, function (err, result) {
                if (err) {
                    return next(err);
                }

                delete result.pass;

                resultPersonnel = result;
            });

            res.status(200).send(resultPersonnel);

        });
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var error;
        var query;

        if (req.session.uId === id) {
            error = new Error();
            error.status(400);

            return next(error);
        }

        /*access.getDeleteAccess(req, res, next, mid, function (access) {
         if (!access) {
         error = new Error();
         error.status(403);

         return next(error);
         }*/

        query = PersonnelModel.remove({_id: id});
        query.exec(function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send();
        });
        /*});*/
    };

    this.getById = function (req, res, next) {
        var id = req.params.id;
        var query = PersonnelModel.findById(id, {pass: 0});

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.getAll = function (req, res, next) {
        PersonnelModel.find({}, {pass: 0})
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

        PersonnelModel.findByIdAndUpdate(id, body, {new: true}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };


    this.forgotPassword = function (req, res, next) {
        var body = req.body;
        var email = body.email;
        var forgotToken = generator.generate();
        var error;
        var mailer = new Mailer();

        email = CONSTANTS.EMAIL_REGEXP.test(email) ? email : false;

        if (!email) {
            error = new Error();
            error.status(400);

            return next(error);
        }

        PersonnelModel.findOneAndUpdate(
            {
                email: email
            },
            {
                $set: {forgotToken: forgotToken}
            },
            {
                new: true
            },
            function (err, result) {
                if (err) {
                    return next(err);
                }

                mailer.forgotPassword(result.toJSON());
                /*res.status(200).send({
                 success: RESPONSES.MAILER.EMAIL_SENT,
                 email: result.email
                 });*/

                /*REMOVE*/
                /*Result must be deleted. Only for test*/

                res.status(200).send(result);
            });
    };

    this.confirm = function (req, res, next) {
        var token = req.params.token;

        var query = PersonnelModel.findOneAndUpdate({token:token}, {token: '', confirmed: new Date()});

        query.exec(function (err) {
            if (err) {
                return next(err);
            }
            return res.status(200).send({confirmed: true});
        });
    };
    this.changePassword = function (req, res, next) {
        var forgotToken = req.params.forgotToken;
        var body = req.body;
        var pass = body.pass;
        var url = process.env.HOST + '/login';

        var shaSum = crypto.createHash('sha256');

        shaSum.update(pass);
        pass = shaSum.digest('hex');

        async.waterfall([updatePass, deleteToken], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(url);
        });

        function updatePass(callback) {

            PersonnelModel.findOneAndUpdate(
                {
                    forgotToken: forgotToken
                },
                {
                    $set: {pass: pass}
                },
                {
                    new: true
                },
                function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, result);
                })
        }

        function deleteToken(result, callback) {
            result
                .set('forgotToken', '')
                .save(function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, result);
                });
        }
    };
};

module.exports = Personnel;