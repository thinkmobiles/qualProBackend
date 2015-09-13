define([], function () {
    /**
     * Drop-in replacement for Backbone.Collection. Encapsulate main pagination logic
     * @see {@link http://backbonejs.org/#Collection|Backbone.Collection }
     * @namespace ParrentCollection
     * @extends Backbone.Collection
     *
     * @property {number} firstPage The first page index. You should only override this value
     * during extension, initialization or reset by the server after
     * fetching. This value should be read only at other times.
     *
     * @property {number} lastPage The last page index. This value
     * is __read only__ and it's calculated during bootstrapping,
     * fetching and resetting. Please don't change this
     * value under any circumstances.
     *
     * @property {number} currentPage The current page index. You
     * should only override this value during extension, initialization or reset
     * by the server after fetching. This value should be read only at other
     * times. If left as default, it will be set to `firstPage`
     * on initialization.
     *
     * @property {number} totalPages How many pages there are. This
     * value is __read only__ and it is calculated from `totalRecords`.
     *
     * @property {number} pageSize How many records to show per
     * page. This value is __read only__ after initialization, if you want to
     * change the page size after initialization, you must call #setPageSize
     *
     * @property {number} totalRecords How many records stored in DB.
     * This value is __read only__.
     */

    var MasterCollection = Backbone.Collection.extend({});

    var Collection = Backbone.Collection.extend({
        firstPage: 1,
        lastPage: null,
        currentPage: null,
        totalPages: null,
        totalRecords: null,
        pageSize: 25,

        offset: function () {
            return this.currentPage * this.pageSize;
        },

        dataComposer: function(page, options){
            var self = this;
            var data;
            var _opts = {};
            var waite = !!options.waite;
            var reset = !!options.reset;

            options = options || {waite: true, reset: true};

            if (options.newCollection) {
                _opts.data = options;
            } else {
                _opts.data = options.data || {};
                waite = !!_opts.data.waite;
                reset = !!_opts.data.reset;
            }

            data = _opts.data;
            data.page = page || this.currentPage;
            data.count = data.count || this.pageSize;
            data.filter = data.filter || {};

            _opts.reset = reset;
            _opts.waite = waite;

            _opts.success = options.success || function (models) {
                    if (self.currentPage !== self.lastPage) {
                        self.currentPage++;
                    }
                    self.trigger('showmore', models);
                };
            _opts.error = options.error || function (models, err) {
                    self.trigger('errorPaganation', err);
                };

            return _opts;
        },

        /**
         * Fetch the page.
         * @param {object} options.
         * @return {XMLHttpRequest} The XMLHttpRequest
         * from fetch or this.
         * @function getPage
         * @memberof ParrentCollection
         * @instance
         */

        getPage: function (page, options) {
           var _opts = this.dataComposer(page, options);

            return this.fetch(_opts);
        },

        /**
         * Fetch the `first` page.
         * @param {object} options.
         * @return {XMLHttpRequest} The XMLHttpRequest
         * from fetch or this.
         * @function getFirstPage
         * @memberof ParrentCollection
         * @instance
         */

        getFirstPage: function (options) {
           this.currentPage = 1;

            this.getPage(1, options);
        },

        /**
         * Fetch the `last` page.
         * @param {object} options.
         * @return {XMLHttpRequest} The XMLHttpRequest
         * from fetch or this.
         * @function getLastPage
         * @memberof ParrentCollection
         * @instance
         */

        getLastPage: function (options) {
            var filterObject = options || {};
            var waite = !!options.waite;
            var page = this.lastPage;

            this.currentPage = page;

            filterObject['page'] = options.page || this.currentPage;
            filterObject['count'] = options.count || this.pageSize;
            filterObject['filter'] = options.filter || {};

            this.getPage(page, {
                data: filterObject,
                waite: waite,
                reset: true
            });
        },

        /**
         * Fetch the `next` page.
         * @param {object} options.
         * @return {XMLHttpRequest} The XMLHttpRequest
         * from fetch or this.
         * @function getLastPage
         * @memberof ParrentCollection
         * @instance
         */

        getNextPage: function (options) {
            var filterObject = options || {};
            var waite = !!options.waite;
            var page = this.currentPage;

            filterObject['page'] = options.page || this.currentPage;
            filterObject['count'] = options.count || this.pageSize;
            filterObject['filter'] = options.filter || {};

            this.getPage(page, {
                data: filterObject,
                waite: waite,
                reset: true
            });
        },

        getPreviousPage: function (options) {
            var filterObject = options || {};
            var waite = !!options.waite;
            var page = --this.currentPage;

            if (page <= 0) {
                page = 1;
            }

            filterObject['page'] = options.page || this.currentPage;
            filterObject['count'] = options.count || this.pageSize;
            filterObject['filter'] = options.filter || {};

            this.getPage(page, {
                data: filterObject,
                waite: waite,
                reset: true
            });
        }
    });
    return Collection;
});