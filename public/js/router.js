define([
    'views/main/main',
    'views/login/login',
    /*'dataService',*/
    'custom',
    /*'common',*/
    'constants'

], function (mainView, loginView/*, dataService*/, custom/*, common*/, CONTENT_TYPES) {

    var appRouter = Backbone.Router.extend({

        wrapperView: null,
        mainView: null,
        topBarView: null,
        view: null,

        routes: {
            "home": "any",
            "login": "login",
            "qualPro/:contentType(/p=:page)(/c=:countPerPage)(/filter=:filter)": "getList",
            "qualPro/:contentType/list(/p=:page)(/c=:countPerPage)(/filter=:filter)": "goToContent",
            "qualPro/:contentType/thumbnails(/c=:countPerPage)(/filter=:filter)": "goToThumbnails",
            "qualPro/:contentType/form/:contentId": "goToForm",

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

        testContent: function (contentType) {
            if (!CONTENT_TYPES[contentType.toUpperCase()]) {
                contentType = CONTENT_TYPES.PERSONNEL;
            }

            return contentType;
        },

        getList: function (contentType, page, countPerPage, filter) {
            var viewType;

            this.contentType = contentType;

            contentType = this.testContent(contentType);
            viewType = custom.getCurrentVT({contentType: contentType});

            if (viewType) {
                Backbone.history.navigate('#qualPro/' + contentType + '/' + viewType, {trigger: true});
            } else {
                this.goToContent(contentType, page, countPerPage, filter);
            }
        },

        goToContent: function (contentType, page, countPerPage, filter) {
            var self = this;

            this.checkLogin(function (success) {
                if (success) {
                    getContent(self);
                } else {
                    self.redirectTo();
                }
            });

            function getContent (context) {
                var newCollection = true;
                var self = context;
                var savedFilter;
                var startTime = new Date();
                var contentViewUrl = "views/" + contentType + "/list/listView";
                var topBarViewUrl = "views/" + contentType + "/topBarView";
                var collectionUrl = "collections/" + contentType + "/collection";
                var navigatePage = (page) ? parseInt(page) : 1;
                var count = (countPerPage) ? parseInt(countPerPage) || 50 : 50;


                if (context.mainView === null) {
                    context.main(contentType);
                } else {
                    context.mainView.updateMenu(contentType);
                }

                require([contentViewUrl, topBarViewUrl, collectionUrl], function (contentView, topBarView, contentCollection) {
                    var collection = new contentCollection({
                        viewType: 'list',
                        page: navigatePage,
                        count: count,
                        filter: savedFilter,
                        contentType: contentType,
                        newCollection: newCollection
                    });

                    collection.bind('reset', _.bind(createViews, self));

                    function createViews () {
                        var topbarView;
                        var contentview;

                        collection.unbind('reset');
                        topbarView = new topBarView({collection: collection});
                        contentview = new contentView({
                            collection: collection,
                            startTime: startTime,
                            filter: savedFilter,
                            newCollection: newCollection
                        });

                        topbarView.bind('createEvent', contentview.createItem, contentview);

                        context.changeView(contentview);
                        context.changeTopBarView(topbarView);
                    }
                });
            }
        },

        changeTopBarView: function (topBarView) {
            if (this.topBarView) {
                this.topBarView.undelegateEvents();
            }
            this.topBarView = topBarView;
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