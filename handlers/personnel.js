var mongoose = require('mongoose');
var CONSTANTS = require('../constants/mainConstants');

var Personnel = function (db) {
    var _ = require('underscore');
    var crypto = require('crypto');
    var access = require('../helpers/access');
    var generator = require('../helpers/randomPass.js');
    var CONSTANTS = require('../constants/mainConstants');
    var RESPONSES = require('../constants/responses');
    var Mailer = require('../helpers/mailer.js');
    var async = require('async');
    var schema = mongoose.Schemas[CONSTANTS.PERSONNEL];
    var personnelSchema = mongoose.Schemas[CONSTANTS.PERSONNEL];
    var PersonnelModel = db.model(CONSTANTS.PERSONNEL, personnelSchema);
    var mid;

    this.create = function (req, res, next) {
        var body = req.body;
        var email = body.email;
        var pass = body.pass;

        var shaSum = crypto.createHash('sha256');
        var personnelModel;

        var err;

        /*access.getEditWritAccess(req, res, next, mid, function (access) {
         if (!access) {
         err = new Error();
         err.status(403);

         return next(err);
         }*/

        email = email ? CONSTANTS.EMAIL_REGEXP.test(email) : false;
        shaSum.update(pass);
        body.pass = shaSum.digest('hex');

        if (email) {
            personnelModel = new PersonnelModel(body);
            personnelModel.save(function (err, personnel) {
                if (err) {
                    return next(err);
                }

                delete personnel.pass;
                res.status(200).send(personnel);
            })
        } else {
            res.status(400).send();
        }
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

        shaSum.update(pass);

        if (email && pass) {
            query = PersonnelModel.findOne({
                email: email
            });
            query.exec(function (err, personnel) {
                if (err) {
                    return next(err);
                }

                if (personnel && personnel.pass === shaSum.digest('hex')) {
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

                    return res.status(200).send(resultPersonnel);
                }

                res.status(400).send();
            });
        } else {
            res.status(400).send();
        }
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var err;
        var query;

        if (req.session.uId === id) {
            err = new Error();
            err.status(400);

            return next(err);
        }

        /*access.getDeleteAccess(req, res, next, mid, function (access) {
         if (!access) {
         err = new Error();
         err.status(403);

         return next(err);
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

        var query = db.model(CONSTANTS.PERSONNEL, schema).findById(id, {pass: 0});
        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.getAll = function (req, res, next) {
        //  var error;
        var Model = db.model(CONSTANTS.PERSONNEL, schema);
        Model.find({pass: 0}).

            exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(result);
            });
    };

    this.update = function (req, res, next) {
        var id = req.params.id;
        var Model = db.model(CONSTANTS.PERSONNEL, schema);
        var body = req.body;

        Model.findByIdAndUpdate(id, body, {new: true}, function (err, result) {
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
        var caheckEmail;
        //var mailer = new Mailer();

        caheckEmail = email ? CONSTANTS.EMAIL_REGEXP.test(email) : false;

        if (!caheckEmail) {
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

                //mailer.forgotPassword(result);
                /*res.status(200).send({
                 success: RESPONSES.MAILER.EMAIL_SENT,
                 email: result.email
                 });*/

                /*REMOVE*/
                /*Result must be deleted. Only for test*/

                res.status(200).send(result);
            });
    };

    this.changePassword = function (req, res, next) {
        var forgotToken = req.params.forgotToken;
        var body = req.body;
        var pass = body.pass;

        var shaSum = crypto.createHash('sha256');
        shaSum.update(pass);
        pass = shaSum.digest('hex');

        async.waterfall([updatePass, deleteToken], function (err, result) {
            if (err) {
                return next(err);
            }

            /*REMOVE*/
            /*Result must be deleted. Only for test*/

            res.status(200).send(result);
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

    this.currentUser = function (req, res, next) {
        var session = req.session;
        if (session && session.loggedIn && session.lastDb) {
            this.getUserById(req, res, next);
        } else {
            return res.status(401).send();
        }
    };

    this.getUserById = function (req, res, next) {
        var id = req.session.uId;
        var query = models.get(req.session.lastDb, 'Users', UserSchema).findById(id);
        var newUserResult = {};
        var savedFilters;

        query.populate('profile')
            .populate('RelatedEmployee', 'imageSrc name fullName')
            .populate('savedFilters');

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            if (result) {
                savedFilters = result.toJSON().savedFilters;

                if (savedFilters) {
                    newUserResult = _.groupBy(savedFilters, 'contentView');
                }
            }

            res.status(200).send({user: result, savedFilters: newUserResult});
        });
    };
};

module.exports = Personnel;