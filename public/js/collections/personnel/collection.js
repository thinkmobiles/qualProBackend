define([
        'models/personnel'
    ],
    function (Model) {
        var Collection = Backbone.Collection.extend({
            model: Model,
            url: "/personnel/",
            page:null,
            namberToShow: null,
            viewType: null,
            contentType: null,

            initialize: function (options) {
                this.startTime = new Date();

                var self = this;

                this.namberToShow = options.count;
                this.viewType = options.viewType;
                this.contentType = options.contentType;
                this.page = options.page || 1;

                this.fetch({
                    data: options,
                    reset: true,
                    success: function() {
                        self.page ++;
                    },
                    error: function (models, xhr) {
                        if (xhr.status == 401) Backbone.history.navigate('#login', { trigger: true });
                    }
                });
            }
        });
        return Collection;
    });