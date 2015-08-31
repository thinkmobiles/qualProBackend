define([
    'text!templates/personnel/list/list.html'
],

function (listTemplate) {
    var PersonsListItemView = Backbone.View.extend({
        el: '#listTable',
        template: _.template(listTemplate),

        initialize: function(options) {
            this.collection = options.collection;
            this.startNumber = (options.page - 1 ) * options.itemsNumber;
        },
        render: function() {
            this.$el.append(this.template({ personnelCollection: this.collection.toJSON(), startNumber: this.startNumber }));
        }
    });

    return PersonsListItemView;
});
