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
