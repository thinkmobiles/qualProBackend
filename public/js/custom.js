define([
    'constants',
    'async',
    'dataService',
    'moment'
], function (CONTENT_TYPES, async, dataService, moment) {

    var runApplication = function (success) {
        var url;

        if (!Backbone.history.fragment) {
            Backbone.history.start({silent: true});
        }

        if (success) {
            url = (App.requestedURL === null) ? Backbone.history.fragment : App.requestedURL;

            if ((url === "") || (url === "login")) {
                url = 'qualPro';
            }

            Backbone.history.fragment = "";
            Backbone.history.navigate(url, {trigger: true});
            if (!App || !App.filterCollections) {
                async.parallel({
                        country: function (callback) {
                            dataService.getData('/country/getForDD', null, callback)
                        },
                        branch: function (callback) {
                            dataService.getData('/branch/getForDD', null, callback)
                        },
                        outlet: function (callback) {
                            dataService.getData('/outlet/getForDD', null, callback)
                        },
                    },
                    function (err, result) {

                        if (err) {
                            return console.dir(err);
                        }
                        App.filterCollections = result;
                    });
            }
        } else {
            if (App.requestedURL === null) {
                App.requestedURL = Backbone.history.fragment;
            }
            Backbone.history.fragment = "";
            Backbone.history.navigate("login", {trigger: true});
        }


    };

    var getCurrentVT = function (option) {
        var viewType;
        var viewVariants = ["list", "thumbnails"];

        if (option && (option.contentType !== App.contentType)) {
            App.ownContentType = false;
        }

        if (option) {
            switch (option.contentType) {
                case CONTENT_TYPES.PERSONNEL:
                case CONTENT_TYPES.COUNTRY:
                    App.currentViewType = 'list';
                    break;
                default:
                    App.currentViewType = "";
                    break;
            }
        }

        if ($.inArray(App.currentViewType, viewVariants) === -1) {
            App.currentViewType = "";
            viewType = "";
        } else {
            viewType = App.currentViewType;
        }

        return viewType;
    };

    var applyDefaults = function () {
        $(document).on("keydown", ".ui-dialog", function (e) {
            if ($(e.target).get(0).tagName.toLowerCase() == "textarea") {
                return;
            }
            switch (e.which) {
                case 27:
                    $(".edit-dialog").remove();
                    break;
                case 13:
                    $(".ui-dialog-buttonset .ui-button").eq(0).trigger("click");
                    break;
                default:
                    break;
            }
        });
        $(document).on("keypress", ".onlyNumber", function (e) {
            var charCode = (e.which) ? e.which : e.keyCode;

            if (charCode > 31 && (charCode < 48 || charCode > 57)) {

                return false;
            }
            return true;
        });

        $(window).on("resize", function (e) {
            $("#ui-datepicker-div").hide();
        });
    };

    var navigateToDefaultUrl = function (options) {
        var defaultLocation = '#qualPro/' + CONTENT_TYPES.PERSONNEL;
        var url = Backbone.history.fragment || defaultLocation;

        if (url === 'qualPro') {
            url = defaultLocation
        }

        Backbone.history.navigate(url, options);
    };

    var dateFormater = function(formatString, dateString){
        var date = moment(dateString);
        var isRender = (App && App.render);

        if((!date || date === 'Invalid date') && isRender){
            App.render({});
        }

        return moment()
    };

    return {
        runApplication: runApplication,
        getCurrentVT: getCurrentVT,
        applyDefaults: applyDefaults,
        navigateToDefaultUrl: navigateToDefaultUrl
    };
});
