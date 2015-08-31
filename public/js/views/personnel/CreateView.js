define([
    "text!templates/personnel/CreateTemplate.html",
    "models/personnel",
    "common",
    //"populate"
],
       function (CreateTemplate, Model, common/*, populate*/) {

           var CreateView = Backbone.View.extend({
               el: "#wrapper",
               contentType: "personnel",
               template: _.template(CreateTemplate),
               imageSrc: '',
               initialize: function () {
                   /*_.bindAll(this, "saveItem");*/
                   this.model = new Model();
               },

               events: {
                   "submit form": "submit",
                   "mouseenter .avatar": "showEdit",
                   "mouseleave .avatar": "hideEdit",
                   "click .current-selected": "showNewSelect",
                   "click": "hideNewSelect"
               },

               render: function () {
                   var formString = this.template();
                   var self = this;
                   this.$el = $(formString).dialog({
                       closeOnEscape: false,
                       autoOpen: true,
                       dialogClass: "edit-dialog",
                       width: "600",
                       resizable: true,
                       title: "Create Pesonnel",
                       buttons:{
                           save:{
                               text:"Create",
                               class:"btn",
                               //click: self.saveItem
                           },
                           cancel:{
                               text:"Cancel",
                               class:"btn",
                               click: function(){
                                   //self.hideDialog();
                               }
                           }
                       }
                   });
                   //populate.get("#profilesDd", "ProfilesForDd", {}, "profileName", this, true);
                   common.canvasDraw({ model: this.model.toJSON() }, this);
                   return this;
               }
           });

           return CreateView;
       });
