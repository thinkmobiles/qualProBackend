define([
        "text!templates/personnel/create.html",
        "models/personnel",
        "common",
        "populate",
        "dataService"
    ],
    function (CreateTemplate, Model, common, populate, dataService) {

        var CreateView = Backbone.View.extend({
                el: "#contentHolder",
                contentType: "personnel",

                template: _.template(CreateTemplate),
                imageSrc: '',

                initialize: function (options) {
                    _.bindAll(this, "saveItem");

                    this.model = new Model();
                    this.responseObj = {};

                    if (options && options.hasOwnProperty('countryId')) {
                        this.model.set('country', options.countryId);
                    }

                    this.render();
                },

                events: {
                    "mouseenter .avatar": "showEdit",
                    "mouseleave .avatar": "hideEdit",
                    "click .current-selected": "showNewSelect",
                    "click": "hideNewSelect"
                },

                showNewSelect: function (e, prev, next) {
                    populate.showSelect(e, prev, next, this);
                    return false;
                },

                saveItem: function () {
                    var self = this;
                    var personnelModel = new Model();
                    var currEl = this.$el;

                    var firstName = $.trim(currEl.find("#firstName").val());
                    var lastName = $.trim(currEl.find("#lastName").val());
                    var email = $.trim(currEl.find("#email").val());
                    var sendPass = currEl.find("#sendPass").prop('checked');
                    var phone = $.trim(currEl.find("#phone").val());
                    var position = currEl.find("#positionDd").attr("data-id");
                    var country = currEl.find("#countryDd").attr("data-id");
                    var manager = currEl.find("#managerDD").attr("data-id");
                    var dateBirth = $.trim(currEl.find("#dateBirth").val());

                    personnelModel.save({
                            sendPass: sendPass,
                            country: country,
                            firstName: _.escape(firstName),
                            lastName: _.escape(lastName),
                            imageSrc: this.imageSrc,
                            email: _.escape(email),
                            phoneNumber: _.escape(phone),
                            position: position,
                            manager: manager,
                            dateBirth: dateBirth,
                            //pass: pass
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
                                Backbone.history.navigate('#qualPro/personnel/list');
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
                    var jsonModel = this.model.toJSON();
                    var formString = this.template(jsonModel);
                    var self = this;

                    this.$el = $(formString).dialog({
                        closeOnEscape: false,
                        autoOpen: true,
                        dialogClass: "edit-dialog",
                        width: "80%",
                        resizable: true,
                        title: "Create Pesonnel",
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
                    populate.get("#countryDd", "/country/getForDD", {}, "name", this, true);

                    $('#dateBirth').datepicker({
                        changeMonth: true,
                        changeYear: true,
                        yearRange: '-100y:c+nn',
                        maxDate: '-18y'
                    });

                    common.canvasDraw({model: this.model.toJSON()}, this);

                    this.delegateEvents(this.events);

                    return this;
                },
            })
            ;


        return CreateView;
    });
