module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var schema = new mongoose.Schema({

        outlet: {type: ObjectId, ref: 'outlet'},
        branch: {type: ObjectId, ref: 'branch'},
        categories: {type: [ObjectId], ref: 'category'},
        name: {type: String, default: ''},
        size: {type: String, default: ''},
        price: {type: Number, default: '0'},
        brandName: {type: String, default: ''},


        creationDate: {type: Date, default: Date.now},
        createdBy: {
            user: {type: ObjectId, ref: 'user', default: null},
            date: {type: Date, default: Date.now}
        },
        editedBy: {
            user: {type: ObjectId, ref: 'user', default: null},
            date: {type: Date, default: Date.now}
        }
    }, {collection: 'priceLists'});

    mongoose.model('priceList', schema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['priceList'] = schema;
})();