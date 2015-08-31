define([
        'text!templates/personnel/topBarTemplate.html',
        'custom',
        'common'
    ],
    function (topBarTemplate, custom, Common) {
        var TopBarView = Backbone.View.extend({
            el:'#topBarHolder',
            contentType: "personnel",
            actionType: null, //Content, Edit, Create
            template: _.template(topBarTemplate),

            events:{
                /*"click a.changeContentView": 'changeContentViewType',
                "click ul.changeContentIndex a": 'changeItemIndex',
                "click #top-bar-deleteBtn": "deleteEvent",
                "click #top-bar-discardBtn": "discardEvent",
                "click #top-bar-editBtn": "editEvent",
                "click #top-bar-createBtn": "createEvent"*/
            },

            render: function(){
                $('title').text(this.contentType);
                var viewType = custom.getCurrentVT();

                this.$el.html(this.template({ viewType: viewType, contentType: this.contentType}));

                return this;
            },
        });

        return TopBarView;
    });