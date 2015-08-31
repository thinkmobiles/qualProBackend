define(['text!templates/menu/left.html'],
    function (template) {

        var LeftMenuView = Backbone.View.extend({
            el: '#leftMenuHolder',
            template: _.template(template),

            events: {
                "click a": "selectMenuItem"
            },


            initialize: function (options) {
                this.collection = options.collection;

                this.render();
            },

            render: function () {
                var self = this;
                //null beacause root modules has parrent=null
                var rootModules = this.collection.get('null');

                function getChild(childId){
                    var child = self.collection.get(childId);

                    return child;
                }

                this.$el.html(this.template({
                    rootModules: rootModules,
                    getChild: getChild
                }));

                return this;
            }
        });

        return LeftMenuView;
    }
);






























