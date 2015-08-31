define(['text!templates/menu/topMenu.html'],
    function (template) {

        var TopMenuView = Backbone.View.extend({
            tagName: 'ul',
            el: '#topMenuHolder',
            template: _.template(template),

            initialize: function (options) {
                this.render();
            },

            render: function () {
                this.$el.html(this.template());

                return this;
            }
        });

        return TopMenuView;
    }
)






























