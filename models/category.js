module.exports = (function () {
    var mongoose = require('mongoose');

    var schema = mongoose.Schema({
        name: { type: String, default: 'All' },

        users: [{ type: ObjectId, ref: 'user', default: null }],
        createdBy: {
            user: { type: ObjectId, ref: 'user', default: null },
            date: { type: Date, default: Date.now }
        },
        editedBy: {
            user: { type: ObjectId, ref: 'user', default: null },
            date: { type: Date }
        }

    }, { collection: 'categories' });

    mongoose.model('category', schema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Category'] = schema;
})();