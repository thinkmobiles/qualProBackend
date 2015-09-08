define([],function () {
    var FilterModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            name: '',
            status: false
        }
    });
    return FilterModel;
});