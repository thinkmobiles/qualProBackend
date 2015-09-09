define([''],function () {
    var Model = Backbone.Model.extend({
        idAttribute: "_id",
        defaults: {
            imageSrc: "",
            name:""
        },

        initialize: function(){
        },

        validate: function(attrs, options){
        },

        urlRoot: function(){
            return "/country";
        }
    });
    return Model;
});