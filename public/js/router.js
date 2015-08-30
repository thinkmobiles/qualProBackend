define([
    'views/main/main',
    'views/login/login',
    /*'dataService',
    'custom',
    'common',
    'constants'*/

], function (mainView, loginView/*, dataService, custom, common, CONTENT_TYPES*/) {

    var appRouter = Backbone.Router.extend({

        wrapperView: null,
        mainView: null,
        topBarView: null,
        view: null,

        routes: {
            "home": "any",
            "login": "login",
            "*any": "any"
        },


        initialize: function () {
            var self = this;

            this.on('all', function () {
                $(".ui-dialog").remove();
                $("#ui-datepicker-div").hide().remove();
            });
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

            if (!App || !App.currentUser) {
                /*dataService.getData('/currentUser', null, function (response) {
                    if (response && !response.error) {
                        App.currentUser = response.user;
                        App.savedFilters = response.savedFilters;
                    } else {
                        console.log('can\'t fetch currentUser');
                    }
                });*/
            };
        },

        redirectTo: function(){
            if (App.requestedURL === null) {
                App.requestedURL = Backbone.history.fragment;
            }
            Backbone.history.fragment = "";
            Backbone.history.navigate("login", {trigger: true});
        },

        changeWrapperView: function (wrapperView) {
            if (this.wrapperView) {
                this.wrapperView.undelegateEvents();
            }
            this.wrapperView = wrapperView;
        },

        changeView: function (view, hideTopBar) {
            if(hideTopBar){
                $('#top-bar').hide();
            } else {
                $('#top-bar').show();
            }

            if (this.view) {
                this.view.undelegateEvents();
            }
            $(document).trigger("resize");
            this.view = view;
        },

        main: function (contentType) {
            this.mainView = new mainView({contentType: contentType});
            this.changeWrapperView(this.mainView);
        },

        any: function () {
            this.mainView = new mainView();
            this.changeWrapperView(this.mainView);
        },

        login: function () {

            this.mainView = null;
            this.changeWrapperView(new loginView());
        }
    });

    return appRouter;
});