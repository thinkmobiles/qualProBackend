define([
        'text!templates/menu/topMenu.html',
        'views/personnel/editView'
    ],
    function (template, personnelEditView) {

        var TopMenuView = Backbone.View.extend({
            tagName: 'ul',
            el: '#topMenuHolder',
            template: _.template(template),

            events: {
                'click .personelShortDetail': 'editPersonel'
            },

            initialize: function (options) {
                this.render();
            },

            editPersonel: function (e) {
                new personnelEditView();
            },

            render: function () {
                var currentUser = App.currentUser;

                this.$el.html(this.template(currentUser));

                return this;
            }
        });

        return TopMenuView;
    }
)






























