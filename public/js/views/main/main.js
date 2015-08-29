define([
    'text!templates/main/main.html',
    /*'views/menu/LeftMenuView',
    'collections/menu/MenuItems',
    'views/menu/TopMenuView',
    'dataService'*/
], function (MainTemplate/*, LeftMenuView, MenuItemsCollection, TopMenuView, dataService*/) {

    var MainView = Backbone.View.extend({
        el: '#wrapper',
        template: _.template(MainTemplate),
        events: {
            'click #loginPanel': 'showSelect',
            'click': 'hideProp'
        },

        initialize: function (options) {
            this.contentType = options ? options.contentType : null;
            this.render();
            /*this.collection = new MenuItemsCollection();
            this.collection.bind('reset', this.createMenuViews, this);*/
        },

        hideProp: function (e) {
            if ($(e.target).closest("#loginPanel").length === 0) {
                var select = this.$el.find('#loginSelect');
                select.hide();
                select.prop('hidden', true);
            }
        },

        createMenuViews: function () {
            var currentRoot = null;
            var currentChildren = null;
            if (this.contentType) {
                currentChildren = this.collection.where({href: this.contentType});
                var currentRootId = currentChildren[0].get("parrent");
                currentRoot = this.collection.where({_id: currentRootId});
            }
            this.leftMenu = new LeftMenuView({
                collection: this.collection,
                currentChildren: currentChildren,
                currentRoot: currentRoot
            });
            this.topMenu = new TopMenuView({
                collection: this.collection.getRootElements(),
                currentRoot: currentRoot,
                leftMenu: this.leftMenu
            });
            this.topMenu.bind('changeSelection', this.leftMenu.setCurrentSection, {leftMenu: this.leftMenu});
            this.topMenu.bind('mouseOver', this.leftMenu.mouseOver, {leftMenu: this.leftMenu});
        },
        updateMenu: function (contentType) {
            var currentChildren = this.collection.where({href: contentType});
            var currentRootId = currentChildren[0].get("parrent");
            var currentRoot = this.collection.where({_id: currentRootId});
            this.leftMenu.updateLeftMenu(currentChildren, currentRoot);
            this.topMenu.updateTopMenu(currentRoot);
        },
        showSelect: function (e) {
            var select = this.$el.find('#loginSelect');
            if (select.prop('hidden')) {
                select.show();
                select.prop('hidden', false);
            } else {
                select.hide();
                select.prop('hidden', true);
            }
        },
        render: function () {
            var currentUser;

            if (!App || !App.currentUser || !App.currentUser.login) {
                /*dataService.getData('/currentUser', null, function (response, context) {
                    currentUser = response.user;
                    App.currentUser = currentUser;

                    if (currentUser && currentUser.profile && currentUser.profile.profileName == 'baned') {
                        $('title').text("QualPro");
                        context.$el.find("li#userpage").remove();
                        context.$el.find("#top-bar").addClass("banned");
                        context.$el.find("#content-holder").append("<div id = 'banned'><div class='icon-banned'></div><div class='text-banned'><h1>Sorry, this user is banned!</h1><p>Please contact the administrator.</p></div></div>");
                    }
                    if (currentUser.RelatedEmployee) {
                        $("#loginPanel .iconEmployee").attr("src", currentUser.RelatedEmployee.imageSrc);
                        if (currentUser.RelatedEmployee.name) {
                            $("#loginPanel  #userName").text(currentUser.RelatedEmployee.name.first + " " + currentUser.RelatedEmployee.name.last);
                        } else {
                            $("#loginPanel  #userName").text(currentUser.login);
                        }
                    } else {
                        $("#loginPanel .iconEmployee").attr("src", currentUser.imageSrc);
                        $("#loginPanel  #userName").text(currentUser.login);
                    }
                }, this);*/

                this.$el.html(this.template());
            } else {
                this.$el.html(this.template());

                var icon = $("#loginPanel .iconEmployee");
                var log = $("#loginPanel  #userName");

                /*if (App.currentUser && App.currentUser.profile && App.currentUser.profile.profileName == 'baned') {
                    $('title').text("QualPro");
                    this.$el.find("li#userpage").remove();
                    this.$el.find("#top-bar").addClass("banned");
                    this.$el.find("#content-holder").append("<div id = 'banned'><div class='icon-banned'></div><div class='text-banned'><h1>Sorry, this user is banned!</h1><p>Please contact the administrator.</p></div></div>");
                }
                if (App.currentUser.RelatedEmployee) {
                    $("#loginPanel .iconEmployee").attr("src", App.currentUser.RelatedEmployee.imageSrc);
                    if (App.currentUser.RelatedEmployee.name) {
                        $("#loginPanel  #userName").text(App.currentUser.RelatedEmployee.name.first + " " + App.currentUser.RelatedEmployee.name.last);
                    } else {
                        $("#loginPanel  #userName").text(App.currentUser.login);
                    }
                } else {
                    icon.attr("src", App.currentUser.imageSrc);
                    log.text(App.currentUser.login);
                }*/
            }

            return this;
        }
    });
    return MainView;
});