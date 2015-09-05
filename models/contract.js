var CONSTANTS = require('../constants/mainConstants');

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var schema = new mongoose.Schema({


        country: {type: ObjectId, ref: CONSTANTS.COUNTRY, default: null},
        outlet: {type: ObjectId, ref: CONSTANTS.OUTLET},
        type: {type: String},
        title: {type: String},
        isArchived: Boolean,

        creationDate: {type: Date, default: Date.now},
        createdBy: {
            user: {type: ObjectId, ref: CONSTANTS.PERSONNEL, default: null},
            date: {type: Date, default: Date.now}
        },
        editedBy: {
            user: {type: ObjectId, ref: CONSTANTS.PERSONNEL, default: null},
            date: {type: Date, default: Date.now}
        }
    }, {collection: 'contracts'});

    mongoose.model(CONSTANTS.CONTRACT, schema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas[CONSTANTS.CONTRACT] = schema;
})();