var mongoose = require('mongoose');
var User = function (models) {
    var _ = require('../node_modules/underscore');
    var UserSchema = mongoose.Schemas['Users'];

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

module.exports = User;