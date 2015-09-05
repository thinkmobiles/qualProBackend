define([
        "text!templates/personnel/edit.html",
        "text!templates/personnel/changePassword.html",
        'models/personnel',
        "populate",
        'common'
    ],
    function (template, changePassword, personnelModel, populate, common) {

        var EditView = Backbone.View.extend({
            contentType: "Personnel",
            imageSrc: '',
            template: _.template(template),
            $errrorHandler: null,

            initialize: function (options) {
                _.bindAll(this, "render", "saveItem", "changePass");

                this.currentModel = App.currentUser;
                this.responseObj = {};
                this.render();
            },

            events: {
                /* "mouseenter .avatar": "showEdit",
                 "mouseleave .avatar": "hideEdit",*/
                "click .current-selected": "showNewSelect",
                "click .upload:not(>input)": "changePassword",
                "click": "hideNewSelect"
            },

            hideDialog: function () {
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
                $(".crop-images-dialog").remove();
            },

            hideChangePassDialog: function () {
                $(".changePass-dialog").remove();
            },

            changePassword: function (e) {
                var self = this;
                var changePassTempl = _.template(changePassword);

                $(changePassTempl()).dialog({
                    modal: true,
                    closeOnEscape: false,
                    autoOpen: true,
                    dialogClass: "changePass-dialog",
                    width: "20%",
                    resizable: true,
                    title: "Change Password",
                    buttons: {
                        save: {
                            text: "Save",
                            class: "btn",
                            click: self.changePass
                        },
                        cancel: {
                            text: "Cancel",
                            class: "btn",
                            click: function () {
                                self.hideChangePassDialog();
                            }
                        }
                    }
                });
            },

            changePass: function (e) {
                var self = this;
                var currEl = this.$el;

                var oldPass = $.trim($("#oldPassword").val());
                var newPass = $.trim($("#newPassword").val());
                var confirmPass = $.trim(currEl.find("#confirmNewPassword").val());

                var canProcess = newPass === confirmPass;

                if (!canProcess) {
                    return App.render({type: 'error', message: 'Passwords mismatch'});
                }

                Model.save({
                        country: country,
                        firstName: firstName,
                        lastName: lastName,
                        imageSrc: this.imageSrc,
                        email: email,
                        phoneNumber: phone,
                        position: position,
                        manager: manager,
                        dateBirth: dateBirth
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
                            self.hideDialog();
                        },
                        error: function (model, xhr) {
                            self.errorNotification(xhr);
                        }
                    });
            },

            saveItem: function () {
                var self = this;
                var Model = new personnelModel(App.currentUser);
                var currEl = this.$el;

                var firstName = $.trim(currEl.find("#firstName").val());
                var lastName = $.trim(currEl.find("#lastName").val());
                var email = $.trim(currEl.find("#email").val());
                var phone = $.trim(currEl.find("#phone").val());
                var position = currEl.find("#positionDd").attr("data-id");
                var country = currEl.find("#countryDd").attr("data-id");
                var manager = currEl.find("#managerDD").attr("data-id");
                var dateBirth = $.trim(currEl.find("#dateBirth").val());

                Model.save({
                        country: country,
                        firstName: firstName,
                        lastName: lastName,
                        imageSrc: this.imageSrc,
                        email: email,
                        phoneNumber: phone,
                        position: position,
                        manager: manager,
                        dateBirth: dateBirth
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
                            self.hideDialog();
                        },
                        error: function (model, xhr) {
                            self.errorNotification(xhr);
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
                    title: "Create Pesonnel",
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
            }

        });

        return EditView;
    });
