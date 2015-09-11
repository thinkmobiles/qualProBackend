define([], function () {
    /**
     * Drop-in replacement for Backbone.Collection. Encapsulate main pagination logic
     * @see {@link http://backbonejs.org/#Collection|Backbone.Collection }
     * @constructor ParrentCollection
     * @extends Backbone.Collection
     *
     * @property {number} firstPage The first page index. You should only override this value
     * during extension, initialization or reset by the server after
     * fetching. This value should be read only at other times.
     *
     * @property {number} lastPage The last page index. This value
     * is __read only__ and it's calculated based on whether `firstPage` is 0 or
     * 1, during bootstrapping, fetching and resetting. Please don't change this
     * value under any circumstances.
     *
     * @property {number} currentPage The current page index. You
     * should only override this value during extension, initialization or reset
     * by the server after fetching. This value should be read only at other
     * times. Can be a 0-based or 1-based index, depending on whether
     * `firstPage` is 0 or 1. If left as default, it will be set to `firstPage`
     * on initialization.
     *
     * @property {number} pageSize How many records to show per
     * page. This value is __read only__ after initialization, if you want to
     * change the page size after initialization, you must call #setPageSize.
     */

    var Collection = Backbone.Collection.extend({
        firstPage: 1,
        lastPage: null,
        currentPage: null,
        pageSize: 25,

        offset: function () {
            return this.currentPage * this.pageSize;
        },

        /**
         * Fetch the first page in server mode, or reset the current page of this
         * collection to the first page in client or infinite mode.
         * @param {object} options.
         * @return {XMLHttpRequest} The XMLHttpRequest
         * from fetch or this.
         * @function getFirstPage
         * @memberof ParrentCollection
         * @instance
         */

        getFirstPage: function (options) {
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
        },

        getLastPage: function (options) {
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
        },

        getPreviousPage: function (options) {
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