define([
        'text!templates/personnel/list/header.html',
        'views/personnel/createView',
        'views/personnel/list/listItemView',
        'views/filter/filtersBarView',
        'collections/personnel/collection'
    ],

    function (headerTemplate, createView, listItemView, filterView, contentCollection) {
        var View = Backbone.View.extend({
            el: '#contentHolder',
            newCollection: null,
            page: null,
            contentType: 'personnel',
            viewType: 'list',
            template: _.template(headerTemplate),

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                this.page = options.collection.page;

                this.render();
            },

            events: {

            },

            render: function () {
                $('.ui-dialog ').remove();

                var self = this;
                var currentEl = this.$el;
                var pagenation = currentEl.find('.pagination');

                currentEl.html('');
                currentEl.append(this.template());
                currentEl.append(new listItemView({
                    collection: this.collection,
                    page: this.page,
                    itemsNumber: this.collection.namberToShow
                }).render());

               /* $(document).on("click", function (e) {
                    self.hideItemsNumber(e);
                });*/

                //currentEl.append(_.template(paginationTemplate));

                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }

                this.filterview = new filterView({ contentType: self.contentType });

                /*this.filterview.bind('filter', function (filter) {
                    this.showFilteredPage(filter, self)
                });
                this.filterview.bind('defaultFilter', function () {
                    this.showFilteredPage({}, self);
                });*/

                this.filterview.render();
            },

            createItem: function () {
                new createView();
            }

        });

        return View;
    });

