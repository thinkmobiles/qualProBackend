var mongoose = require('mongoose');
var Personnel = function (db) {
    var _ = require('../node_modules/underscore');
    var CONSTANTS = require('../constants/mainConstants');
    var personnelSchema = mongoose.Schemas['personnel'];
    var crypto = require('crypto');

    this.registration = function (req, res, next) {
        var body = req.body;
        var email = body.email;
        var pass = body.pass;

        var shaSum = crypto.createHash('sha256');
        var PersonnelModel = db.model('personnels', personnelSchema);
        var personnelModel;

        email = email ? CONSTANTS.EMAIL_REGEXP.test(email) : false;
        body.pass = shaSum.update(pass);

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
    };

    this.login = function (req, res, next) {
        var session = req.session;
        var body = req.body;
        var email = body.email;
        var pass = body.pass;
        var shaSum = crypto.createHash('sha256');

        var personnelModel = db.model('personnels', personnelSchema);
        var query;

        var lastAccess;

        shaSum.update(pass);

        if (email && pass) {
            query = personnelModel.findOne({
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

                    personnelModel.findByIdAndUpdate(personnel._id, {$set: {lastAccess: lastAccess}}, function (err, result) {
                        if (err) {
                            return next(err);
                        }
                    });

                    return res.status(200).send();
                }

                res.status(400).send();
            });
        } else {
            res.status(400).send();
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
        var id = req.session.uId
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