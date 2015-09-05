var CONSTANTS = require('../constants/mainConstants');

module.exports = (function () {
    var mongoose = require('mongoose');

    var prioritySchema = mongoose.Schema({
        _id: Number,
        priority: String
    }, { collection: 'priorities' });

    mongoose.model(CONSTANTS.PRIORITY, prioritySchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas[CONSTANTS.PRIORITY] = prioritySchema;
})();