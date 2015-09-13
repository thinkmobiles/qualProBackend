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
                this.getFirstPage(options);
            }
        });
        return Collection;
    });