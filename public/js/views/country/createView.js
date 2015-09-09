define([
        "text!templates/country/create.html",
        "models/country",
        "common"
        //"populate"
    ],
    function (CreateTemplate, Model, common/*, populate*/) {

        var CreateView = Backbone.View.extend({
            el: "#contentHolder",
            contentType: "country",
            template: _.template(CreateTemplate),
            imageSrc: '',

            initialize: function () {
                _.bindAll(this, "saveItem");
                this.model = new Model();

                this.render();
            },

            events: {
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
                "click .current-selected": "showNewSelect",
                "click": "hideNewSelect"
            },

            saveItem: function () {
                var self = this;
                var model = new Model();
                var currEl = this.$el;

                var name = $.trim(currEl.find("#name").val());
                var manager = currEl.find("#managerDD").attr("data-id");

                model.save({

                        name: name,
                        imageSrc: this.imageSrc,
                        manager: manager,
                        /*groups: {
                         owner: $("#allUsersSelect").data("id"),
                         users: usersId,
                         group: groupsId
                         },
                         whoCanRW: whoCanRW,*/
                    },
                    {
                        wait: true,
                        success: function (model, response) {
                            Backbone.history.fragment = '';
                            Backbone.history.navigate('#qualPro/country/list');
                        },
                        error: function (model, xhr) {
                            App.render({type: 'error', message: xhr.responseText});
                        }
                    });
            },

            hideDialog: function () {
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
                $(".crop-images-dialog").remove();
            },

            render: function () {
                var formString = this.template();
                var self = this;

                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen: true,
                    dialogClass: "edit-dialog",
                    width: "80%",
                    resizable: true,
                    title: "Create Country",
                    buttons: {
                        save: {
                            text: "Create",
                            class: "btn",
                            click: self.saveItem
                        },
                        cancel: {
                            text: "Cancel",
                            class: "btn",
                            click: function () {
                                self.hideDialog();
                            }
                        }
                    }
                });
                //populate.get("#profilesDd", "ProfilesForDd", {}, "profileName", this, true);

                common.canvasDraw({model: this.model.toJSON()}, this);
                return this;
            }
        });

        return CreateView;
    });
