define(['collections/parrent',
        'models/personnel'
    ],
    function (Parrent, Model) {
        var Collection = /*Backbone.Collection*/Parrent.extend({
            model: Model,
            url: "/personnel/",
            viewType: null,
            contentType: null,

            initialize: function (options) {
                var page;

                options = options || {};
                page = options.page;
                options.reset = true;

                this.getPage(page, options);
            },

            parse: function(response){
                this.totalRecords = response.total;

                return response.data;
            }
        });

        return Collection;
    });