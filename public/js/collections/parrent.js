define([], function () {
    /**
     * This collection encapsulate main pagination logic
     * @namespace ParrentCollection
     */
    /*books.getFirstPage();
     books.getPreviousPage();
     books.getNextPage();
     books.getLastPage();*/

    var Collection = Backbone.Collection.extend({
        firstPage: 1,
        lastPage: null,
        currentPage: null,
        pageSize: 25,

        offset: function () {
            return this.currentPage * this.pageSize;
        },

        getNextPage: function (options) {
            var self = this;
            var filterObject = options || {};

            filterObject['page'] = (options && options.page) ? options.page : this.currentPage;
            filterObject['count'] = (options && options.count) ? options.count : this.pageSize;
            filterObject['filter'] = (options) ? options.filter : {};

            this.fetch({
                data: filterObject,
                waite: true,

                success: function (models) {
                    self.currentPage++;
                    self.trigger('showmore', models);
                },
                error: function (models, err) {
                    self.trigger('errorPaganation', err);
                }
            });
        }
    });
    return Collection;
});