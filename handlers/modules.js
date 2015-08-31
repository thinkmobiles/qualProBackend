var mongoose = require('mongoose');
var _ = require('lodash');

var Module = function (db) {
    var moduleSchema = mongoose.Schemas['module'];
    var positionSchema = mongoose.Schemas['position'];

    this.getAll = function (req, res, next) {
        var Module = db.model('module', moduleSchema);
        var Profile = db.model('position', positionSchema);

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

                        modules = _.groupBy(modules, 'parrent');
                        res.status(200).send(modules);
                    });
            /*}
        );*/
    }
};

module.exports = Module;