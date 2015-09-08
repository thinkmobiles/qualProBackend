define([
    'text!templates/country/list/list.html'
],

function (listTemplate) {
    var CountryListItemView = Backbone.View.extend({
        el: '#listTable',
        template: _.template(listTemplate),

        initialize: function(options) {
            this.collection = options.collection;
            this.startNumber = (options.page - 1 ) * options.itemsNumber;
        },
        render: function() {
            this.$el.append(this.template({ countryCollection: this.collection.toJSON(), startNumber: this.startNumber }));
        }
    });

    return CountryListItemView;
});
