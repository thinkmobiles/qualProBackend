define([
    'text!templates/main/main.html',
    'views/menu/left',
    'collections/menu/menuItems',
    'views/menu/topMenu'
    /*'dataService'*/
], function (MainTemplate, LeftMenuView, MenuItemsCollection, TopMenuView /*dataService*/) {

    var MainView = Backbone.View.extend({
        el: '#wrapper',
        template: _.template(MainTemplate),
        events: {
            'click #loginPanel': 'showSelect',
            'click': 'hideProp'
        },

        initialize: function (options) {
            this.contentType = options ? options.contentType : null;
            this.render();
            this.collection = new MenuItemsCollection();
            this.collection.bind('reset', this.createMenuViews, this);
        },

        hideProp: function (e) {
            if ($(e.target).closest("#loginPanel").length === 0) {
                var select = this.$el.find('#loginSelect');
                select.hide();
                select.prop('hidden', true);
            }
        },

        createMenuViews: function () {
            var currentChildren = this.collection.where({href: "activityList"});
            var currentRootId = currentChildren[0].get("parrent");
            var currentRoot = this.collection.where({_id: currentRootId});

            this.leftMenu = new LeftMenuView({
                collection: this.collection,
                currentChildren: currentChildren,
                currentRoot: currentRoot,
                rootElementsCollection: this.collection.getRootElements()
            });
        },

        render: function () {
            this.$el.html(this.template());

            return this;
        }
    });
    return MainView;
});