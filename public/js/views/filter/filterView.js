define([
        'text!templates/filter/filterTemplate.html',
        'collections/filter/filterCollection',
        'constants'
    ],
    function (valuesTemplate, filterCollection, CONSTANTS) {
        var filterValuesView = Backbone.View.extend({
            template: _.template(valuesTemplate),

            events: {
                'click .dropDown': 'showHideValues',
            },

            showHideValues:function(sender){
                this.$el.find('.ulContent').toggle();
            },

            initialize: function (options) {
                this.status = options.status;
                this.currentPage = 1;
                this.filterName = options.filterName;
                this.filterDisplayName = options.filterDisplayName;
                this.collection = options.currentCollection;
                this.collectionLength = this.collection.length;
                this.elementToShow = options.elementToShow || (CONSTANTS.FILTERVALUESCOUNT > this.collectionLength) ? this.collectionLength : CONSTANTS.FILTERVALUESCOUNT;

                this.paginationBool = (this.collectionLength > this.elementToShow) ? true : false;

                this.allPages = Math.ceil(this.collectionLength / this.elementToShow);

                this.$el = $(options.element);
            },

            paginationChange: function (e, context) {
                var curEl = $(e.target);

                if (curEl.hasClass('prev')) {
                    context.currentPage--;
                } else {
                    context.currentPage++;
                }

                context.renderContent();
            },

            renderContent: function () {
                var displayCollection;
                var valuesContainer = this.$el.find(".ulContent");
                var ulElement = valuesContainer.find(".filterValues");
                var paginationLi = valuesContainer.find('.miniStylePagination');
                var element;

                this.start = (this.currentPage - 1) * this.elementToShow;
                this.end = Math.min(this.currentPage * this.elementToShow, this.collectionLength);

                var prevPage;
                var nextPage;
                var status = '';

                displayCollection = this.collection.toJSON();
                displayCollection = displayCollection.slice(this.start, this.end);

                ulElement.html('');

                for (var i = 0; i <= (this.elementToShow - 1); i++) {
                    element = displayCollection[i];
                    if (element) {
                        if (element.status) {
                            status = ' class="checkedValue"';
                        } else {
                            status = '';
                        }

                        if (element._id) {
                            ulElement.append('<li data-value="' + element._id + '"' + status + '>' + element.name + '</li>');
                        }
                    }
                }

                paginationLi.find('.counter').html((this.start + 1) + '-' + this.end + ' of ' + this.collectionLength);

                prevPage = paginationLi.find('.prev');
                nextPage = paginationLi.find('.next');


                if (this.currentPage === 1 && !prevPage.hasClass('disabled')) {
                    prevPage.addClass('disabled');
                } else if (this.currentPage === this.allPages && !nextPage.hasClass('disabled')) {
                    nextPage.addClass('disabled');
                } else {
                    prevPage.removeClass('disabled');
                    nextPage.removeClass('disabled');
                }
            },

            render: function () {
                var self = this;

                this.$el.append(this.template({
                    filterDisplayName: this.filterDisplayName,
                    status: this.status,
                    filterName: this.filterName,
                    paginationBool: this.paginationBool
                }));

                this.renderContent();

                this.$el.find("[id='" + this.filterName + "Values'] .miniStylePagination a").click(function (e) {
                    self.paginationChange(e, self);
                });

                this.$el.find('.ulContent').toggle();
            }
        });

        return filterValuesView;
    }
);