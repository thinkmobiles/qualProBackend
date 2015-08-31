define([
        'views/menu/topMenuItem'
    ],
    function (TopMenuItemView) {

        var TopMenuView = Backbone.View.extend({
            tagName: 'ul',
            el: '#mainmenu-holder nav ul',
            selectedModule: null,

            initialize: function (options) {

            },

            events: {
                "click": "clickItem"
//                "click > li": "mouseOver"
            },

            render: function () {

                return this;
            }
        });

        return TopMenuView;
    }
)






























