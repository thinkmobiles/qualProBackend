define(['models/parrent'],function (parent) {
    var Model = parent.extend({
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