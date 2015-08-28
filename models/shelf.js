module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var schema = new mongoose.Schema({


        country: {type: ObjectId, ref: 'country', default: null},
        outlet: {type: ObjectId, ref: 'outlet'},
        branch: {type: ObjectId, ref: 'branch'},
        category: {type: ObjectId, ref: 'category', default: null},
        shares: {
            item: {type: ObjectId, ref: 'item'},
            distanceInMeters: {type: Number}
        },
        comments: {type: [ObjectId], ref: 'comment'},


        creationDate: {type: Date, default: Date.now},
        createdBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },
        editedBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        }
    }, {collection: 'shelves'});

    mongoose.model('shelf', schema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['shelf'] = schema;
})();