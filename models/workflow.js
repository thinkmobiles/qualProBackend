/**
 * Created by Roman on 04.04.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var schema = mongoose.Schema({
        status: String,
        name: String,
        collectionType: String
    }, {collection: 'workflows'});

    mongoose.model('workflow', schema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['workflow'] = schema;
})();