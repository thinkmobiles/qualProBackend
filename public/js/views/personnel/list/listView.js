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
            contentType: 'personnel',
            viewType: 'list',
            template: _.template(headerTemplate),

            initialize: function (options) {
                this.defaultItemsNumber = this.collection.pageSize;
                this.listLength = this.collection.totalRecords;
                this.startTime = options.startTime;
                this.collection = options.collection;
                this.page = options.collection.page;

                this.render();

                this.inputEvent = _.debounce(
                    function (e) {
                        var target = e.target;
                        var value = target.value;

                        this.collection.getSearchedCollection('fullName', value, contentCollection);

                    }, 500);
            },

            events: {
            },

            showFilteredPage: function (filter) {
                var itemsNumber = $("#itemsNumber").text();

                this.filter = filter;

                this.startTime = new Date();
                this.newCollection = false;
                //this.filter = custom.getFiltersValues(chosen, defaultFilterStatus, logicAndStatus);

                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);

                this.changeLocationHash(1, itemsNumber, filter);
                this.collection.getFirstPage({count: itemsNumber, filter: filter});
                //this.getTotalLength(null, itemsNumber, filter);
            },

            render: function () {
                $('.ui-dialog ').remove();

                var self = this;
                var currentEl = this.$el;

                var pagination = this.$pagination = $('#paginationHolder');
                var searchInput;

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

                this.filterView = new filterView({ contentType: self.contentType });

                this.filterView.bind('filter', function (filter) {
                    self.showFilteredPage(filter, self)
                });
                this.filterView.bind('defaultFilter', function () {
                    self.showFilteredPage({}, self);
                });

                this.filterView.render();

                searchInput = $("#searchInput");

                searchInput.keyup(function (e) {
                    self.inputEvent(e)
                });

                this.pageElementRender(this.listLength, this.collection.currentPage);
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

