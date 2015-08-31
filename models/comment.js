/**
 * Created by micha on 8/28/2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var schema = new mongoose.Schema({

        target: {type: ObjectId},
        person: {type: ObjectId, ref: 'personell'},
        body: String,

        creationDate: {type: Date, default: Date.now},
        createdBy: {
            user: {type: ObjectId, ref: 'personnel', default: null},
            date: {type: Date, default: Date.now}
        },
        editedBy: {
            user: {type: ObjectId, ref: 'personnel', default: null},
            date: {type: Date, default: Date.now}
        }
    }, {collection: 'comments'});

    mongoose.model('comment', schema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['comment'] = schema;
})();