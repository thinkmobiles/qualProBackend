define([
    'views/main/MainView',
    'views/login/LoginView',
    'dataService',
    'custom',
    'common',
    'constants'

], function (mainView, loginView, dataService, custom, common, CONTENT_TYPES) {

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
                if (charCode > 31 && (charCode < 48 || charCode > 57))
                    return false;
                return true;
            });
            $(window).on("resize", function (e) {
                $("#ui-datepicker-div").hide();
                //				$(".hasDatepicker").datepicker("destroy");
            });
            $(document).on("paste", ".onlyNumber", function (e) {
                return false;
            });

            var self = this;

            $(document).on("click", function () {
                var currentContentType = self.contentType ? self.contentType.toUpperCase() : '';
                var contentTypes = {QUOTATION: 'Quotation', ORDER: 'Order', INVOICE: 'Invoice'};
                if (contentTypes[currentContentType]) {
                    $(".list2 tbody").find("[data-id='false']").remove();
                }
            });
            if (!App || !App.currentUser) {
                dataService.getData('/currentUser', null, function (response) {
                    if (response && !response.error) {
                        App.currentUser = response.user;
                        App.savedFilters = response.savedFilters;
                    } else {
                        console.log('can\'t fetch currentUser');
                    }
                });
            };
        },

        redirectTo: function(){
            if (App.requestedURL === null) {
                App.requestedURL = Backbone.history.fragment;
            }
            Backbone.history.fragment = "";
            Backbone.history.navigate("login", {trigger: true});
        },

        revenue: function(){
            var self = this;

            if(!this.isAuth) {
                this.checkLogin(function (success) {
                    if (success) {
                        self.isAuth = true;
                        renderRevenue();
                    } else {
                        self.redirectTo();
                    }
                });
            } else {
                renderRevenue();
            }

            function renderRevenue () {
                var startTime = new Date();
                var contentViewUrl = "views/Revenue/index";

                if (self.mainView === null) {
                    self.main("Revenue");
                } else {
                    self.mainView.updateMenu("Revenue");
                }

                require([contentViewUrl], function (contentView) {
                    var contentview;

                    custom.setCurrentVT('list');

                    contentview = new contentView({startTime: startTime});

                    self.changeView(contentview, true);
                });
            }
        },

        attendance: function () {
            var self = this;

            this.checkLogin(function (success) {
                if (success) {
                    renderAttendance(self);
                } else {
                    self.redirectTo();
                }
            });

            function renderAttendance(context) {
                var contentViewUrl = "views/Attendance/index";
                var self = context;

                if (context.mainView === null) {
                    context.main("Attendance");
                } else {
                    context.mainView.updateMenu("Attendance");
                }

                require([contentViewUrl], function (contentView) {
                    var contentview = new contentView();
                    self.changeView(contentview);
                });
            }
        },

        buildCollectionRoute: function (contentType) {
            if (!contentType) {
                throw new Error("Error building collection route. ContentType is undefined");
            }
            switch (contentType) {
                case 'Birthdays':
                    return "collections/" + contentType + "/filterCollection";
                default:
                    return "collections/" + contentType + "/filterCollection";
            }
        },

        testContent: function (contentType) {
            if (!CONTENT_TYPES[contentType.toUpperCase()])
                contentType = CONTENT_TYPES.PERSONS;
            return contentType;
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
            var url = "/getDBS";
            var self = this;

            this.mainView = null;

            $.ajax({
                url: url,
                type: "GET",
                success: function (response) {
                    self.changeWrapperView(new loginView({dbs: response.dbsNames}));
                },
                error: function () {
                    self.changeWrapperView(new loginView());
                }
            });
        }
    });

    return appRouter;
});