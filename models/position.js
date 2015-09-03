var CONSTANTS = require('../constants/mainConstants');

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var positionSchema = mongoose.Schema({
        _id: Number,
        name: {type: String, default: ''},
        profileAccess: [{
            module: {type: Number, ref: "modules"},
            access: {
                read: {type: Boolean, default: false},
                editWrite: {type: Boolean, default: false},
                del: {type: Boolean, default: false}
            }
        }],
        description: String,
        whoCanRW: {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},
        groups: {
            owner: {type: ObjectId, ref: CONSTANTS.PERSONNEL, default: null},
            users: [{type: ObjectId, ref: CONSTANTS.PERSONNEL, default: null}],
            group: [{type: ObjectId, ref: CONSTANTS.OUTLET, default: null}]
        },
        numberOfPersonnels: {type: Number, default: 0},
        createdBy: {
            user: {type: ObjectId, ref: CONSTANTS.PERSONNEL, default: null},
            date: {type: Date, default: Date.now}
        },
        editedBy: {
            user: {type: ObjectId, ref: CONSTANTS.PERSONNEL, default: null},
            date: {type: Date, default: Date.now}
        }
    }, {collection: 'positions'});

    mongoose.model(CONSTANTS.POSITION, positionSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas[CONSTANTS.POSITION] = positionSchema;
})();