var mongoose = require('mongoose');

var Module = function (db) {
    var moduleSchema = mongoose.Schemas['module'];
    var profileSchema = mongoose.Schemas['profile'];

    this.getAll = function (req, res, next) {
        var Module = db.model('module', moduleSchema);
        var Profile = db.model('profile', profileSchema);

        /*Profile.aggregate(
            {
                $project: {
                    profileAccess: 1
                }
            },
            {
                $match: {
                    _id: id
                }
            },
            {
                $unwind: "$profileAccess"
            },

            {
                $match: {
                    'profileAccess.access.read': true
                }
            },
            {$group: {_id: "$profileAccess.module"}},

            function (err, result) {
                if (err) {
                    return next(err);
                }*/

                Module.find().
                    //where('_id').in(result).
                    where({visible: true}).
                    sort({sequence: 1}).
                    exec(function (err, modules) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send(modules);
                    });
            /*}
        );*/
    }
};

module.exports = Module;