var App = App ||
    {
        file: {
            MAXSIZE: 10485760,  //size in kilobytes  = 3 MB
            MaxFileSizeDisplay: "10 MB"
        },
        requestedURL: null,
        savedFilters: {}
    };

require.config({
    paths: {
        async: './libs/async/lib/async',
        jQuery: './libs/jquery/dist/jquery.min',
        //ajaxForm: './libs/jquery-ajax-form/jquery-ajax-form',
        imageCrop: './libs/Jcrop/js/jquery.Jcrop.min',
        jqueryui: './libs/jquery-ui/jquery-ui.min',
        Underscore: './libs/underscore/underscore-min',
        Backbone: './libs/backbone/backbone-min',
        templates: '../templates',
        text: './libs/requirejs-text/text',
        helpers: 'helpers',
        constants: 'constants',
        d3: './libs/d3/d3.min',
        moment: './libs/moment/moment'
    },
    shim: {
        'jqueryui': ['jQuery'],
        //'ajaxForm': ['jQuery'],
        'imageCrop': ['jQuery'],
        'Backbone': ['Underscore', 'jQuery'],
        'app': ['Backbone', 'jqueryui', /*'ajaxForm',*/ 'imageCrop'],
        'd3': {
            exports: 'd3'
        }
    }
});

require(['app'], function (app) {
    App.errorContainer = $('#errorHandler');

    App.render = function (data) {
        var container = this.errorContainer;
        var messageClass = data.type || 'error';
        var text = data.message || 'Something went wrong';
        var renderEl = '<div class="animate ' + messageClass + '">' + text + '</div>';

        container.append(renderEl);

        container.find('div.animate').delay(10).animate({
            left: "85%",
            opacity: 1
        }, 500, function () {
            var self = $(this);

            self.removeClass('animate').delay(5000).animate({
                left: "100%",
                opacity: 0
            }, 1000, function () {
                self.remove();
            });
        });
    };

    Backbone.View.prototype.changeLocationHash = function (page, count, filter) {
        var location = window.location.hash;
        var mainLocation = '#easyErp/' + this.contentType + '/' + this.viewType;
        var pId = (location.split('/pId=')[1]) ? location.split('/pId=')[1].split('/')[0] : '';
        if (!page && this.viewType == 'list') {
            page = (location.split('/p=')[1]) ? location.split('/p=')[1].split('/')[0] : 1;
        }

        if (!count) {
            var thumbnails = location.split('thumbnails')[0];
            count = (location.split('/c=')[1]) ? location.split('/c=')[1].split('/')[0] : 100;
            if (thumbnails && count < 100)
                count = 100;
        }
        var url = mainLocation;
        if (pId)
            url += '/pId=' + pId;
        if (page)
            url += '/p=' + page;
        if (count)
            url += '/c=' + count;
        if (!filter) {
            var locatioFilter = location.split('/filter=')[1];
            filter = (locatioFilter) ? JSON.parse(decodeURIComponent(locatioFilter)) : null;
        }
        if (filter) {
            var notEmptyFilter = false;
            for (var i in filter) {
                if (filter[i] && filter[i].length !== 0) {
                    notEmptyFilter = true;
                }
            }
            if (notEmptyFilter) {
                url += '/filter=' + encodeURIComponent(JSON.stringify(filter));
            } else url += '';
        }

        Backbone.history.navigate(url);
    };

    Backbone._sync = Backbone.sync;
    // override original sync method to make header request contain csrf token
    Backbone.sync = function (method, model, options, error) {
        options.beforeSend = function (xhr) {
            xhr.setRequestHeader('X-CSRF-Token', $("meta[name='csrf-token']").attr('content'));
        };
        /* proxy the call to the old sync method */
        return Backbone._sync(method, model, options, error);
    };

    app.initialize();
    app.applyDefaults();
});
