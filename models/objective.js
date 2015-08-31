var CONSTANTS = require('../constants/mainConstants');

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var objectiveSchema = mongoose.Schema({
        description: {type: String, default: 'emptyObjective'},
        name: {type: String, default: 'emptyObjective'},
        outlet: {type: ObjectId, ref: 'outlet', default: null},
        manager: {type: ObjectId, ref: CONSTANTS.PERSONNEL, default: null},
        description: String,
        whoCanRW: {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},
        groups: {
            owner: {type: ObjectId, ref: CONSTANTS.PERSONNEL, default: null},
            users: [{type: ObjectId, ref: CONSTANTS.PERSONNEL, default: null}],
            group: [{type: ObjectId, ref: 'outlet', default: null}]
        },
        parent: {type: ObjectId, ref: 'objective', default: null},
        children: [{type: ObjectId, ref: 'objective', default: null}],
        date: [{type: Date, default: Date.now}],
        status: {type: ObjectId, ref: 'status', default: null},
        assignment: [{type: ObjectId, ref: CONSTANTS.PERSONNEL, default: null}],
        currentProgress: {type: Number, default: 0},
        createdBy: {
            user: {type: ObjectId, ref: CONSTANTS.PERSONNEL, default: null},
            date: {type: Date, default: Date.now}
        },
        comments: [{type: ObjectId, ref: 'comment', default: null}],
        attachments: {type: Array, default: []},
        editedBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date}
        }
    }, {collection: 'objectives'});

    mongoose.model('objective', objectiveSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['objective'] = objectiveSchema;
})();