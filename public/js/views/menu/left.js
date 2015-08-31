define([
    'views/menu/menuItem'
],
    function (MenuItemView) {

        var LeftMenuView = Backbone.View.extend({
            tagName: 'nav',
            className: 'menu',
            el: '#submenu-holder nav',
            currentSection: null,
            selectedId: null,

            events: {
                "click a": "selectMenuItem"
            },


            initialize: function (options) {

            },

            render: function (onMouseOver, selectedId) {
                var $el = $(this.el);
                $el.html('');

               return this;
            }
        });

        return LeftMenuView;
    }
)






























