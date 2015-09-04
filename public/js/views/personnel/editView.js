define([
        "text!templates/personnel/edit.html",
        'models/personnel',
        "populate",
        'common'
    ],
    function (template, personnelModel, populate, common) {

        var EditView = Backbone.View.extend({
            contentType: "Personnel",
            imageSrc: '',
            template: _.template(template),

            initialize: function (options) {
                _.bindAll(this, "render", "saveItem");

                this.currentModel = App.currentUser;
                this.responseObj = {};
                this.render();
            },

            events: {
                "mouseenter .avatar": "showEdit",
                "mouseleave .avatar": "hideEdit",
                "click .current-selected": "showNewSelect",
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
                var Model = new personnelModel(App.currentUser);
                var currEl = this.$el;

                var firstName = $.trim(currEl.find("#firstName").val());
                var lastName = $.trim(currEl.find("#lastName").val());
                var email = $.trim(currEl.find("#email").val());
                var pass = $.trim(currEl.find("#password").val());
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
                        dateBirth: dateBirth,
                        pass: pass
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
                            //self.attachView.sendToServer(null,model.changed);
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
                    closeOnEscape: false,
                    autoOpen: true,
                    dialogClass: "edit-dialog",
                    width: "80%",
                    resizable: true,
                    title: "Create Pesonnel",
                    buttons:{
                        save:{
                            text:"Save",
                            class:"btn",
                            click: self.saveItem
                        },
                        cancel:{
                            text:"Cancel",
                            class:"btn",
                            click: function(){
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

                common.canvasDraw(currentUser, this);

                return this;
            }

        });

        return EditView;
    });
