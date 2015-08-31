var mongoose = require('mongoose');

var Personnel = function (db) {
    var _ = require('../node_modules/underscore');
    var CONSTANTS = require('../constants/mainConstants');

    var personnelSchema = mongoose.Schemas['personnel'];
    var access = require('../helpers/access');
    var crypto = require('crypto');
    var mid;

    this.create = function (req, res, next) {
        var body = req.body;
        var email = body.email;
        var pass = body.pass;

        var shaSum = crypto.createHash('sha256');
        var PersonnelModel = db.model('personnels', personnelSchema);
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

        var PersonnelModel = db.model('personnels', personnelSchema);
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
        var PersonnelModel = db.model('personnels', personnelSchema);
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
            })
        /*});*/
    };

    this.update = function (req, res, next) {
        var id = req.params.id;

        try {
            if (options && options.changePass) {

                var shaSum = crypto.createHash('sha256');
                shaSum.update(data.pass);
                data.pass = shaSum.digest('hex');
                models.get(req.session.lastDb, 'Users', userSchema).findById(_id, function (err, result) {

                    if (err) {
                        logWriter.log("User.js update profile.update" + err);
                        res.send(500, {error: 'User.update BD error'});
                    } else {
                        var shaSum = crypto.createHash('sha256');
                        shaSum.update(data.oldpass);
                        var _oldPass = shaSum.digest('hex');
                        if (result.pass == _oldPass) {
                            delete data.oldpass;
                            updateUser();
                        } else {
                            logWriter.log("User.js update Incorect Old Pass");
                            res.send(500, {error: 'Incorect Old Pass'});
                        }
                    }
                });
            } else {
                updateUser();
            }

            function updateUser() {
                var query = {};
                var key = data.key;
                var deleteId = data.deleteId;
                var id;
                var savedFilters = models.get(req.session.lastDb, 'savedFilters', savedFiltersSchema);
                var filterModel = new savedFilters();


                if (data.changePass) {
                    query = {$set: data};

                    updateThisUser(_id, query);
                } else if (data.deleteId) {
                    savedFilters.findByIdAndRemove(deleteId, function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        if (result) {
                            id = result.get('_id');
                            query = {$pull: {'savedFilters': deleteId}};

                            updateThisUser(_id, query);
                        }
                    });
                } else if (data.filter && data.key) {

                    filterModel.contentView = key;
                    filterModel.filter = data.filter;

                    filterModel.save(function (err, result) {
                        if (err) {
                            return console.log('error save filter');
                        };

                        if (result){
                            id = result.get('_id');
                            query = {$push: {'savedFilters': id}};

                            updateThisUser(_id, query);
                        }
                    });
                } else {
                    query = {$set: data};
                    updateThisUser(_id, query);
                }

                function updateThisUser(_id, query) {
                    models.get(req.session.lastDb, 'Users', userSchema).findByIdAndUpdate(_id, query, function (err, result) {
                        //if (err) {
                        //    logWriter.log("User.js update profile.update" + err);
                        //    res.send(500, {error: 'User.update DB error'});
                        //} else {
                        //    req.session.kanbanSettings = result.kanbanSettings;
                        //    if (data.profile && (result._id == req.session.uId))
                        //        //res.send(200, {success: 'User updated success', logout: true});
                        //    res.status(200).send(result);
                        //    else
                        //        res.status(200).send(result);
                        //       // res.send(200, {success: 'User updated success'});
                        //}
                        if (err) {
                            return next(err);
                        }
                        req.session.kanbanSettings = result.kanbanSettings;
                        if (data.profile && (result._id == req.session.uId)) {
                            res.status(200).send({success: result, logout: true});
                        } else {
                            res.status(200).send({success: result});
                        }
                    });
                }

            }
        }
        catch (exception) {
            logWriter.log("Profile.js update " + exception);
            res.send(500, {error: 'User.update BD error'});
        }
    }




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