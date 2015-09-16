define([
        'collections/parrent',
        'models/country'
    ],
    function (Parrent, Model) {
        var Collection = /*Backbone.Collection*/Parrent.extend({
            model: Model,
            url: "/country/",
            viewType: null,
            contentType: null,

            initialize: function (options) {
                var page;

                options = options || {};
                page = options.page;
                options.reset = true;

                this.getPage(page, options);
            }
        });
        return Collection;
    });