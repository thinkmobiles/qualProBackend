define([
        'text!templates/personnel/topBarTemplate.html',
        'text!templates/pagination/pagination.html',
        'custom',
        'common'
    ],
    function (topBarTemplate, pagination, custom, Common) {
        var TopBarView = Backbone.View.extend({
            el:'#topBarHolder',
            contentType: "personnel",
            template: _.template(topBarTemplate),
            paginationTemplate: _.template(pagination),

            events:{
                /*"click a.changeContentView": 'changeContentViewType',
                "click ul.changeContentIndex a": 'changeItemIndex',
                "click #top-bar-deleteBtn": "deleteEvent",
                "click #top-bar-discardBtn": "discardEvent",
                "click #top-bar-editBtn": "editEvent",*/
                "click .itemsNumber": "switchPageCounter",
                "change #currentShowPage": "showPage",
                "click #top-bar-createBtn": "createEvent",
                "click #firstShowPage": "firstPage",
                "click #previousPage": "previousPage",
                "click #nextPage": "nextPage",
                "click #lastShowPage": "lastPage"
            },

            initialize: function(options) {
                if (options.collection) {
                    this.collection = options.collection;
                    this.collection.bind('reset', _.bind(this.render, this));
                }
                this.render();
            },

            switchPageCounter: function (e) {
                e.preventDefault();

                this.trigger('switchPageCounter', e);
            },

            createEvent: function (e) {
                e.preventDefault();

                this.trigger('createEvent');
            },

            showPage: function(e){
                e.preventDefault();

                this.trigger('getPage');
            },

            firstPage: function(e){
                e.preventDefault();

                this.trigger('firstPage');
            },

            previousPage: function(e){
                e.preventDefault();

                this.trigger('previousPage');
            },

            lastPage: function(e){
                e.preventDefault();

                this.trigger('lastPage');
            },

            nextPage: function(e){
                e.preventDefault();

                this.trigger('previousPage');
            },

            render: function(){
                var viewType;
                var thisEl = this.$el;
                var paginationContainer;

                $('title').text(this.contentType);

                viewType = custom.getCurrentVT();

                thisEl.html(this.template({
                    viewType: viewType,
                    contentType: this.contentType
                }));

                paginationContainer = thisEl.find('#paginationHolder');
                paginationContainer.html(this.paginationTemplate());

                return this;
            }
        });

        return TopBarView;
    });