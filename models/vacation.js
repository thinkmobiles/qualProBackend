/**
 * Created by soundstorm on 30.06.15.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var vacationSchema = new mongoose.Schema({
        ID: Number,
        employee: {
            _id: {type: ObjectId, ref: 'Employees', default: null},
            name: String
        },
        department: {
            _id: {type: ObjectId, ref: 'Department', default: null},
            name: String
        },
        vacations: {},
        //startDate: Date,
        //endDate: Date,
        month: Number,
        year: Number,
        //vacationType: String,
        vacArray: Array


    }, {collection: 'Vacation'});

    vacationSchema.set('toJSON', {virtuals: true});

    mongoose.model('Vacation', vacationSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Vacation'] = vacationSchema;
})();