define([
    "text!templates/personnel/create.html",
    "models/personnel",
    "common",
    //"populate"
],
       function (CreateTemplate, Model, common/*, populate*/) {

           var CreateView = Backbone.View.extend({
               el: "#contentHolder",
               contentType: "personnel",
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
                   var personnelModel = new Model();
                   var currEl = this.$el;

                   var firstName = $.trim(currEl.find("#firstName").val());
                   var lastName = $.trim(currEl.find("#lastName").val());
                   var email = $.trim(currEl.find("#email").val());
                   var pass = $.trim(currEl.find("#password").val());
                   var phone = $.trim(currEl.find("#phone").val());
                   var position = $("#positionDd").attr("data-id");
                   var country = $("#countryDd").attr("data-id");
                   var manager = $("#managerDD").attr("data-id");
                   var dateBirth = $.trim(currEl.find("#dateBirth").val());

                   var valid = personnelModel.save({
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
                   if (!valid){
                       $("#createBtnDialog").removeAttr("disabled");
                   }
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
                       title: "Create Pesonnel",
                       buttons:{
                           save:{
                               text:"Create",
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

                   common.canvasDraw({ model: this.model.toJSON() }, this);
                   return this;
               }
           });

           return CreateView;
       });
