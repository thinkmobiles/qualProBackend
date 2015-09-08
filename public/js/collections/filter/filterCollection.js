define([
    'models/filterModel'
], function (FilterModel) {
    var FilterCollection = Backbone.Collection.extend({
        model: FilterModel,

        comparator: function (filterModel) {
            return filterModel.get('name');
        },

        initialize: function () {
        }
    });
    return FilterCollection;
});