define(['custom'],function (custom) {
    var Model = Backbone.Model.extend({
        idAttribute: "_id",

        parse: function(model){
            if(model.createdBy && model.createdBy.date){
                model.createdBy.date = custom.dateFormater('MMM DD, YYYY', model.createdBy.date);
            }

            return model;
        }
    });
    return Model;
});