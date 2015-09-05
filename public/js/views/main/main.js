define([
    'text!templates/main/main.html',
    'views/menu/left',
    'models/module',
    'views/menu/topMenu',
    'dataService',
    'custom'
], function (MainTemplate, LeftMenuView, MenuItemsCollection, TopMenuView, dataService, custom) {

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
            var self = this;

            if (!App || !App.currentUser) {
                dataService.getData('/personnel/currentUser', null, function (err, currentUser) {
                    if (err) {
                        //ToDo display error in error handler
                        console.log('can\'t fetch currentUser');
                    } else {
                        App.currentUser = currentUser;
                        self.topMenu = new TopMenuView();
                    }
                });
            } else if (!this.topMenu) {
                this.topMenu = new TopMenuView();
            }

            this.leftMenu = new LeftMenuView({
                collection: this.collection
            });

            custom.navigateToDefaultUrl({trigger: true, replace: true});
        },

        render: function () {
            this.$el.html(this.template());

            return this;
        }
    });
    return MainView;
});