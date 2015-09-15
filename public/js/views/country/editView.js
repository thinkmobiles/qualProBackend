define([
        "text!templates/country/edit.html",
        'models/country',
        "populate",
        'common',
        "views/personnel/createView"
    ],
    function (template, Model, populate, common, CreateViewPersonnel) {

        var EditView = Backbone.View.extend({
            contentType: "country",
            imageSrc: '',
            template: _.template(template),
            $errrorHandler: null,


            initialize: function (model) {
                _.bindAll(this, "render", "saveItem");

                if (!model) {
                    alert("Wrong, wrong, wrong!!! No country model here")
                }
                this.model = model;
                this.render();
            },

            events: {
                /* "mouseenter .avatar": "showEdit",
                 "mouseleave .avatar": "hideEdit",*/
                "click .current-selected": "showNewSelect",

                "click .addPersons": "addPersons",
                "click": "hideNewSelect"
            },

            hideDialog: function () {
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
                $(".crop-images-dialog").remove();
            },

            saveItem: function () {
                var self = this;

                var currEl = this.$el;

                var name = $.trim(currEl.find("#name").val());
                var manager = currEl.find("#managerDD").attr("data-id");

                this.model.save({
                        name: name,
                        imageSrc: this.imageSrc,
                        manager: manager,
                    },
                    {
                        wait: true,
                        success: function (model, response) {

                            alert('saved');
                            self.hideDialog();
                            Backbone.history.fragment = '';
                            Backbone.history.navigate('#qualPro/country/list', {trigger: true});


                        },
                        error: function (model, xhr) {
                            App.render({type: 'error', message: xhr.responseText});
                        }
                    });
            },

            render: function () {
                var self = this;
                var jsonModel = this.model.toJSON();
                var formString = this.template(jsonModel);

                this.$el = $(formString).dialog({
                    modal: true,
                    closeOnEscape: false,
                    autoOpen: true,
                    dialogClass: "edit-dialog",
                    width: "80%",
                    resizable: true,
                    title: "Edit Country",
                    buttons: {
                        save: {
                            text: "Save",
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
                populate.get("#profilesDd", "ProfilesForDd", {}, "profileName", this, true);
                populate.get("#countryDd", "/country/getForDD", {}, "name", this, true);

                this.delegateEvents(this.events);

                this.$errrorHandler = $('#errorHandler');
                return this;
            },

            addPersons: function (e) {
                e.preventDefault();
                new CreateViewPersonnel({country: this.model});
            }

        });

        return EditView;
    });
