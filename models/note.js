var CONSTANTS = require('../constants/mainConstants');

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var schema = new mongoose.Schema({

        country: {type: ObjectId, ref: CONSTANTS.COUNTRY},
        outlet: {type: ObjectId, ref: 'outlet'},
        branch: {type: ObjectId, ref: 'branch'},
        description: {type: String, default: ''},
        comments: {
            target: {type: ObjectId},
            person: {type: ObjectId, ref: CONSTANTS.PERSONNEL},
            body: String
        },
        attachments: [String],
        persons: {type: [ObjectId], ref: CONSTANTS.PERSONNEL},

        creationDate: {type: Date, default: Date.now},
        createdBy: {
            user: {type: ObjectId, ref: 'user', default: null},
            date: {type: Date, default: Date.now}
        },
        editedBy: {
            user: {type: ObjectId, ref: 'user', default: null},
            date: {type: Date, default: Date.now}
        }
    }, {collection: 'notes'});

    mongoose.model('note', schema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['note'] = schema;
})();