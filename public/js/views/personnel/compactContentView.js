define([
        'text!templates/personnel/compactContent.html',
        'views/createView'
    ],

    function (compactContentTemplate, CreateView) {
        var compactContentView = Backbone.View.extend({

            className: "form", //todo check class name logic

            events: {
                "click #personnels p>a": "openPersonnelDialog"
            },

            initialize: function (options) {
                this.collection = options.collection;

                this.render();
            },

            template: _.template(compactContentTemplate),

            openPersonnelDialog: function (e) {
                e.preventDefault();
                alert('personell popup');
                var itemId = $(e.target).closest('a').attr('id');


                //todo show popup
            },

            render: function () {
                this.$el.html(this.template({
                    collection: this.collection,

                }));
                return this;
            },

            createItem: function () {
                new CreateView();
            }
        });
        return compactContentView;
    });