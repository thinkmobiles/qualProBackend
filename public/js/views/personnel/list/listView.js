define([
        'text!templates/personnel/list/header.html',
        'views/personnel/createView',
        'views/personnel/list/listItemView',
        'views/filter/filtersBarView',
        'views/paginator',
        'collections/personnel/collection'
    ],

    function (headerTemplate, createView, listItemView, filterView, paginator, contentCollection) {
        var View = paginator.extend({
            el: '#contentHolder',
            newCollection: null,
            page: null,
            contentType: 'personnel',
            viewType: 'list',
            template: _.template(headerTemplate),
            $pagination: null,

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

                var pagination = this.$pagination = $('#paginationHolder');

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

                if (this.collection.length === 0) {
                    pagination.hide();
                } else {
                    pagination.show();
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

            showMoreContent: function (newModels) {
                var holder = this.$el;
                var itemView;
                var pagination = this.$pagination;

                holder.find("#listTable").empty();
                itemView = new listItemView({
                    collection: newModels,
                    page: holder.find("#currentShowPage").val(),
                    itemsNumber: holder.find("span#itemsNumber").text()
                });

                holder.append(itemView.render());
                itemView.undelegateEvents();

                if (newModels.length !== 0) {
                    pagination.show();
                } else {
                    pagination.hide();
                }

                $('#check_all').prop('checked', false);
            },

            createItem: function () {
                new createView();
            }

        });

        return View;
    });

