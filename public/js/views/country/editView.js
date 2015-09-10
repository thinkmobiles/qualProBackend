define([
        "text!templates/personnel/edit.html",
        "text!templates/personnel/changePassword.html",
        'models/personnel',
        "populate",
        'common',
        "views/personnel/createView"
    ],
    function (template, changePassword, personnelModel, populate, common, CreateViewPersonnel) {

        var EditView = Backbone.View.extend({
            contentType: "country",
            imageSrc: '',
            template: _.template(template),
            $errrorHandler: null,

            initialize: function () {
                _.bindAll(this, "render", "saveItem");

                this.currentModel = new personnelModel(App.currentUser);
                this.responseObj = {};
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
                var model = new Model();
                var currEl = this.$el;

                var name = $.trim(currEl.find("#name").val());
                var manager = currEl.find("#managerDD").attr("data-id");

                model.save({
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
                var currentUser = App.currentUser;
                var formString = this.template(currentUser);

                this.$el = $(formString).dialog({
                    modal: true,
                    closeOnEscape: false,
                    autoOpen: true,
                    dialogClass: "edit-dialog",
                    width: "80%",
                    resizable: true,
                    title: "Create Country",
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
                //populate.get("#profilesDd", "ProfilesForDd", {}, "profileName", this, true);

                $('#dateBirth').datepicker({
                    changeMonth: true,
                    changeYear: true,
                    yearRange: '-100y:c+nn',
                    maxDate: '-18y'
                });

                common.canvasDraw({model: currentUser}, this);

                this.delegateEvents(this.events);

                this.$errrorHandler = $('#errorHandler');
                return this;
            },

            addPersons: function (e) {
                e.preventDefault();
                new CreateViewPersonnel();
            },

        });

        return EditView;
    });
