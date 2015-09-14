define([], function(){
    var View = Backbone.View.extend({

        nextPage: function(options){


            this.collection.getNextPage(options);
        },

        previousPage: function(options){
            this.collection.getPreviousPage(options);
        },

        firstPage: function(options){
            this.collection.getFirstPage(options);
        },

        lastPage: function(options){
            this.collection.getLastPage(options);
        },

        getPage: function(options){
            this.collection.getPage(options);
        }

    });


    return View;
});