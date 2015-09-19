var mongoose = require('mongoose');
var CONSTANTS = require('../constants/mainConstants');

var Personnel = function (db, event) {
    var validator = require('validator');

    var crypto = require('crypto');
    var access = require('../helpers/access');
    var generator = require('../helpers/randomPass.js');
    var CONSTANTS = require('../constants/mainConstants');
    //var RESPONSES = require('../constants/responses');
    var Mailer = require('../helpers/mailer');
    var FilterMapper = require('../helpers/filterMapper');
    var async = require('async');
    var personnelSchema = mongoose.Schemas[CONSTANTS.PERSONNEL];
    var PersonnelModel = db.model(CONSTANTS.PERSONNEL, personnelSchema);
    var xssFilters = require('xss-filters');
    //var mid;

    this.getForDD = function (req, res, next) {
        var query = req.query;
        var queryObject = query ? query : {};

        PersonnelModel.find(queryObject, '_id firstName lastName').

            exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(result);
            });
    };

    this.create = function (req, res, next) {

        var body = req.body;
        var email = body.email;
        var isEmailValid;
        var personnelModel;
        var error;
        var countryId;
        var personnelId;
        var Country = db.model(CONSTANTS.COUNTRY, mongoose.Schemas[CONSTANTS.COUNTRY]);

        isEmailValid = CONSTANTS.EMAIL_REGEXP.test(email);
        body.token = token;

        if (!isEmailValid) {
            error = new Error();
            error.status = 400;
            return next(error);
        }

        email = validator.escape(email);
        email = xssFilters.inHTMLData(email);
        body.email = email;

        personnelModel = new PersonnelModel(body);
        personnelModel.save(function (err, personnel) {
            if (err) {
                return next(err);
            }

            countryId = personnel.country;
            personnelId = personnel._id;

            event.emit('createdChild', countryId, Country, '_id', 'personnels', personnelId, true);

            res.status(201).send({_id: personnel._id});
        });
    };

    this.login = function (req, res, next) {
        var session = req.session;
        var body = req.body;
        var email = body.email;
        var pass = body.pass;
        var shaSum = crypto.createHash('sha256');
        var query;
        var isEmailValid;

        var lastAccess;
        var resultPersonnel;
        var error;

        shaSum.update(pass);
        isEmailValid = CONSTANTS.EMAIL_REGEXP.test(email);

        if (!email || !pass || !isEmailValid) {
            error = new Error();
            error.status = 400;

            return next(error);
        }

        email = validator.escape(email);
        email = xssFilters.inHTMLData(email);

        query = PersonnelModel.findOne({
            email: email
        });
        query.exec(function (err, personnel) {
            var year = 365 * 24 * 60 * 60 * 1000;

            if (err) {
                return next(err);
            }

            if (!personnel || personnel.pass !== shaSum.digest('hex')) {
                error = new Error();
                error.status = 400;

                return next(error);
            }


            session.loggedIn = true;
            session.uId = personnel._id;
            session.uName = personnel.login;
            lastAccess = new Date();
            session.lastAccess = lastAccess;

            if (body.rememberMe === 'true') {
                session.remeberMe = true;
                session.cookie.expires = new Date(Date.now() + year);
                session.cookie.maxAge = year;
            } else {
                delete session.remeberMe;
                session.cookie.expires = false;
            }


            PersonnelModel.findByIdAndUpdate(personnel._id, {$set: {lastAccess: lastAccess}}, {pass: 0}, function (err, result) {
                if (err) {
                    return next(err);
                }

                //delete result.pass;

                resultPersonnel = result;
            });

            res.status(200).send(resultPersonnel);

        });
    };
    this.remove = function (req, res, next) {
        var id = req.params.id;
        var error;
        var query;

        //if (req.session.uId === id) {
        //    error = new Error();
        //    error.status = 400;
        //
        //    return next(error);
        //}

        /*access.getDeleteAccess(req, res, next, mid, function (access) {
         if (!access) {
         error = new Error();
         error.status = 403;

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

    this.archive = function (req, res, next) {
        var id = req.params.id;
        res.status(501).send();
    };

    this.getById = function (req, res, next) {
        var id = req.params.id || req.session.uId;
        var query = PersonnelModel.findById(id, {pass: 0});

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.getAll = function (req, res, next) {
        var query = req.query;
        var projectionObject = {pass: 0};
        var page = query.page || 1;
        var limit = query.count || parseInt(CONSTANTS.LIST_COUNT);
        var skip = (page - 1) * limit;
        var filterMapper = new FilterMapper();
        var queryObject = query.filter ? filterMapper.mapFilter(query.filter) : {};

        var parallelTasks;

        function contentFinder(parallelCb) {
            PersonnelModel.find(queryObject, projectionObject)
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
            PersonnelModel.count(queryObject, function (err, result) {
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
        var seriesTasks = [findByIdAndUpdate];

        var pass = generator.generate(8);
        var token = generator.generate();
        var mailer = new Mailer();
        var shaSum = crypto.createHash('sha256');

        function findBiId(seriesCb) {
            PersonnelModel.findById(id, function (err, personnel) {
                var shaSum;

                if (err) {
                    return seriesCb(err);
                }

                shaSum = crypto.createHash('sha256');
                shaSum.update(body.newPass);
                body.newPass = shaSum.digest('hex');

                shaSum = crypto.createHash('sha256');
                shaSum.update(body.oldPass);
                body.oldPass = shaSum.digest('hex');

                if (personnel.pass === body.oldPass) {
                    delete body.oldPass;
                    body.pass = body.newPass;

                    seriesCb(null, body);
                } else {
                    err = new Error('Incorrect old password');
                    err.status = 400;

                    seriesCb(err);
                }
            });
        };

        function findByIdAndUpdate(data, seriesCb) {
            if (typeof data === 'function') {
                seriesCb = data;
                data = body;
            }

            PersonnelModel.findByIdAndUpdate(id, data, {new: true}, seriesCb);
        };

        if (body.oldPass && body.newPass) {
            seriesTasks.unshift(findBiId);
        } else if (body.sendPass) {
            shaSum.update(pass);
            body.pass = shaSum.digest('hex');
            body.token = token;
        }

        async.series(seriesTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            if (body.sendPass) {
                mailer.confirmNewUserRegistration(
                    {
                        firstName: result[0].firstName,
                        lastName: result[0].lastName,
                        email: result[0].email,
                        password: pass,
                        token: result[0].token
                    });
            }

            res.status(200).send({success: 'Personnel was updated success'});
        });
    };

    this.forgotPassword = function (req, res, next) {
        var body = req.body;
        var email = body.email;
        var forgotToken = generator.generate();
        var error;
        var mailer = new Mailer();
        var isValidEmail = CONSTANTS.EMAIL_REGEXP.test(email);

        if (!isValidEmail) {
            error = new Error();
            error.status = 400;

            return next(error);
        }

        email = validator.escape(email);
        email = xssFilters.inHTMLData(email);

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

                res.status(200).send();
            });
    };

    this.confirm = function (req, res, next) {
        var token = req.params.token;

        var query = PersonnelModel.findOneAndUpdate({token: token}, {token: '', confirmed: new Date()});

        query.exec(function (err) {
            if (err) {
                return next(err);
            }
            //res.status(200).send({confirmed: true});
            res.redirect(302, process.env.HOST + '/#login');
        });
    };

    this.changePassword = function (req, res, next) {
        var forgotToken = req.params.forgotToken;
        var body = req.body;
        var pass = body.pass;
        var url = process.env.HOST + '/#login';

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
                });
        }

        function deleteToken(result, callback) {
            var error;

            if (!result) {
                error = new Error();
                error.status = 400;

                return next(error);
            }

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