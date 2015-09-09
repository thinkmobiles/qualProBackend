define([
        'text!templates/country/list/header.html',
        'views/country/createView',
        'views/country/list/listItemView',
        'views/filter/filtersBarView',
        'collections/country/collection'
    ],

    function (headerTemplate, createView, listItemView, filterView, contentCollection) {
        var View = Backbone.View.extend({
            el: '#contentHolder',
            newCollection: null,
            page: null,
            contentType: 'country',
            viewType: 'list',
            template: _.template(headerTemplate),

            events: {
                "click .checkbox": "checked"
            },

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                this.page = options.collection.page;

                this.render();
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
                    itemsNumber: this.collection.numberToShow
                }).render());

                $('#check_all').click(function () {
                    $(':checkbox').prop('checked', this.checked);
                    //if ($("input.checkbox:checked").length > 0)
                    //    $("#top-bar-deleteBtn").show();
                    //else
                    //    $("#top-bar-deleteBtn").hide();
                });
                /* $(document).on("click", function (e) {
                 self.hideItemsNumber(e);
                 });*/

                //currentEl.append(_.template(paginationTemplate));

                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }

                //this.filterview = new filterView({contentType: self.contentType});

                /*this.filterview.bind('filter', function (filter) {
                 this.showFilteredPage(filter, self)
                 });
                 this.filterview.bind('defaultFilter', function () {
                 this.showFilteredPage({}, self);
                 });*/

                //this.filterview.render();

                return this;
            },

            createItem: function () {
                new createView();
            },

            checked: function () {
                var checkLength;

                if (this.collection.length > 0) {
                    checkLength = $("input.checkbox:checked").length;
                    //if ($("input.checkbox:checked").length > 0) {
                    //    $("#top-bar-deleteBtn").show();
                    if (checkLength == this.collection.length) {
                        $('#check_all').prop('checked', true);
                    }
                    //}
                    else {
                        //$("#top-bar-deleteBtn").hide();
                        $('#check_all').prop('checked', false);
                    }
                }
            }

        });

        return View;
    });

