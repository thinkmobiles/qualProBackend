module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var schema = mongoose.Schema({
        name: { type: String, default: 'All' },

        users: [{ type: ObjectId, ref: 'personnel', default: null }],
        createdBy: {
            user: { type: ObjectId, ref: 'personnel', default: null },
            date: { type: Date, default: Date.now }
        },
        editedBy: {
            user: { type: ObjectId, ref: 'personnel', default: null },
            date: { type: Date }
        }

    }, { collection: 'categories' });

    mongoose.model('category', schema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Category'] = schema;
})();