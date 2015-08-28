/**
 * Created by Roman on 04.04.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var positionSchema = mongoose.Schema({
        _id: Number,
        name: { type: String, default: '' },
        access: [{
            module: { type: Number, ref: "modules" },
            access: {
                read: { type: Boolean, default: false },
                editWrite: { type: Boolean, default: false },
                del: { type: Boolean, default: false }
            }
        }],
        description: String,
        whoCanRW: { type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne' },
        groups: {
            owner: { type: ObjectId, ref: 'personnel', default: null },
            users: [{ type: ObjectId, ref: 'personnel', default: null }],
            group: [{ type: ObjectId, ref: 'outlet', default: null }]
        },
        numberOfPersonnels: { type: Number, default: 0 },
        createdBy: {
            user: { type: ObjectId, ref: 'personnel', default: null },
            date: { type: Date, default: Date.now }
        },
        editedBy: {
            user: { type: ObjectId, ref: 'personnel', default: null },
            date: { type: Date, default: Date.now }
        }
    }, { collection: 'positions' });

    mongoose.model('position', positionSchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['position'] = positionSchema;
})();