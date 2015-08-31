define([''],function () {
    var Model = Backbone.Model.extend({
        idAttribute: "_id",
        defaults: {
            imageSrc: "",
            email:"",
            position:null,
        },

        initialize: function(){
        },

        validate: function(attrs, options){
        },

        urlRoot: function(){
            return "/personnel";
        }
    });
    return Model;
});