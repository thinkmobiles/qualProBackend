define([
        'views/personnel/createView',
        'views/personnel/list/listItemView',
        'collections/personnel/collection'
    ],

    function (createView, listItemView, contentCollection) {
        var View = Backbone.View.extend({
            el: '#contentHolder',
            newCollection: null,
            page: null,
            contentType: 'personnel',
            viewType: 'list',

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
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
                currentEl.append(_.template(listTemplate));
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
            },

            createItem: function () {
                new createView();
            }

        });

        return View;
    });

