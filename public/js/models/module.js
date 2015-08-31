define([ ],
    function () {
        var Model = Backbone.Model.extend({
            idAttribute: "_id",
            initialize: function(){
                var self = this;

                this.fetch({
                    success: function(model){
                        self.trigger('reset');
                    },
                    error: function(){}
                });
            },

            urlRoot: function () {
                return "/modules";
            }
        });
        return Model;
    });
