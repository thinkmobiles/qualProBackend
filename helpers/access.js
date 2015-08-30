var access = function (db) {
    var mongoose = require('mongoose');
    var positionSchema = mongoose.Schemas['position'];
    var personnelSchema = mongoose.Schemas['personnel'];

    this.getAccess = function (req, res, next, mid, callback) {
        var uId = req.session.uId;

        var personnelModel = db.model('personnels', personnelSchema);
        var positionModel = db.model('positions', positionSchema);

        var personnelQuery = personnelModel.findById(uId);
        var positionQuery;

        var error;

        personnelQuery.exec(function (err, personnel) {
            if (err) {
                return next(err);
            } else if (!personnel) {
                error = new Error();
                error.status(500);

                return next(error);
            }

            positionQuery = positionModel.aggregate(
                {
                    $project: {
                        profileAccess: 1
                    }
                },
                {
                    $match: {
                        _id: personnel.position
                    }
                },
                {
                    $unwind: "$profileAccess"
                },
                {
                    $match: {
                        'profileAccess.module': mid
                    }
                },
                function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    return callback(result)
                }
            );
        });
    };

    this.getReadAccess = function (req, res, next, mid, callback) {
        this.getAccess(req, res, next, mid, function (result) {
            if (result) {
                callback(result[0].profileAccess.access.read);
            }
        });
    };
    this.getEditWritAccess = function (req, res, next, mid, callback) {
        this.getAccess(req, res, next, mid, function (result) {
            if (result) {
                callback(result[0].profileAccess.access.editWrite);
            }
        });
    };

    this.getDeleteAccess = function (req, res, next, mid, callback) {
        this.getAccess(req, res, next, mid, function (result) {
            if (result) {
                callback(result[0].profileAccess.access.del);
            }
        });
    };
};
module.exports = access;
