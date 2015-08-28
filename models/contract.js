/**
 * Created by micha on 8/28/2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var schema = new mongoose.Schema({


        country: {type: ObjectId, ref: 'country', default: null},
        outlet: {type: ObjectId, ref: 'outlet'},
        type: {type: String},
        title: {type: String},


        creationDate: {type: Date, default: Date.now},
        createdBy: {
            user: {type: ObjectId, ref: 'users', default: null},
            date: {type: Date, default: Date.now}
        },
        editedBy: {
            user: {type: ObjectId, ref: 'users', default: null},
            date: {type: Date, default: Date.now}
        }
    }, {collection: 'contracts'});

    mongoose.model('contract', schema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['contract'] = schema;
})();