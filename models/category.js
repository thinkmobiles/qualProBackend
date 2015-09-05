var CONSTANTS = require('../constants/mainConstants');

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var schema = mongoose.Schema({
        name: {type: String, default: 'All'},
        isArchived: Boolean,
        users: [{type: ObjectId, ref: CONSTANTS.PERSONNEL, default: null}],
        createdBy: {
            user: {type: ObjectId, ref: CONSTANTS.PERSONNEL, default: null},
            date: {type: Date, default: Date.now}
        },
        editedBy: {
            user: {type: ObjectId, ref: CONSTANTS.PERSONNEL, default: null},
            date: {type: Date}
        }

    }, {collection: 'categories'});

    mongoose.model(CONSTANTS.CATEGORY, schema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas[CONSTANTS.CATEGORY] = schema;
})();