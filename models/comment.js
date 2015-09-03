var CONSTANTS = require('../constants/mainConstants');

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var schema = new mongoose.Schema({

        target: {type: ObjectId},
        person: {type: ObjectId, ref: CONSTANTS.PERSONNEL},
        body: String,

        creationDate: {type: Date, default: Date.now},
        createdBy: {
            user: {type: ObjectId, ref: CONSTANTS.PERSONNEL, default: null},
            date: {type: Date, default: Date.now}
        },
        editedBy: {
            user: {type: ObjectId, ref: CONSTANTS.PERSONNEL, default: null},
            date: {type: Date, default: Date.now}
        }
    }, {collection: 'comments'});

    mongoose.model(CONSTANTS.COMMENT, schema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas[CONSTANTS.COMMENT] = schema;
})();