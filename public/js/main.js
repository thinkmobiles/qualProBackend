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
        imageCrop: './libs/Jcrop/js/Jcrop.min',
        jqueryui: './libs/jquery-ui/jquery-ui.min',
        Underscore: './libs/underscore/underscore',
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

    Backbone.View.prototype.errorNotification = function (xhr) {
        var errorHandler = $('#errorHandler');
        if (xhr) {
            if (xhr.status === 401 || xhr.status === 403) {
                if (xhr.status === 401) {
                    errorHandler.text('Bad Login');
                    errorHandler.stop().delay(500).animate({ scrollTop: (errorHandler.filter(":first").position().top -30) },'slow');

                    Backbone.history.navigate("login", { trigger: true });
                } else {
                    alert("You do not have permission to perform this action");
                }
            } else {
                if (xhr.responseJSON) {
                    alert(xhr.responseJSON.error);
                } else {
                    Backbone.history.navigate("home", { trigger: true });
                }
            }
        }
    };

    app.initialize();
    app.applyDefaults();
});
