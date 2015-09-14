define([
        'text!templates/filter/filterTemplate.html',
        'collections/filter/filterCollection',
        'constants'
    ],
    function (valuesTemplate, filterCollection, CONSTANTS) {
        var filterValuesView = Backbone.View.extend({
            template: _.template(valuesTemplate),

            initialize: function (options) {
                _.bindAll(this, "renderContent");
                this.status = options.status;
                this.currentPage = 1;
                this.filterName = options.filterName;
                this.filterDisplayName = options.filterDisplayName;
                this.collection = options.currentCollection;
                this.collectionLength = this.collection.length;
                this.elementToShow = options.elementToShow || (CONSTANTS.FILTERVALUESCOUNT > this.collectionLength) ? this.collectionLength : CONSTANTS.FILTERVALUESCOUNT;

                this.allPages = Math.ceil(this.collectionLength / this.elementToShow);

                this.$el = $(options.element);

                this.filteredCollection = new filterCollection(this.collection.toJSON());
                this.filteredCollection.on('reset', this.renderContent);

                this.inputEvent = _.debounce(
                    function (e) {
                        var target = e.target;
                        var value = target.value;
                        var newFilteredCollection;

                        if (!value) {
                            return this.filteredCollection.reset(this.collection.toJSON());
                        }

                        newFilteredCollection = this.filterCollection(value);

                        this.filteredCollection.reset(newFilteredCollection);
                    }, 500);


                _.bindAll(this, "inputEvent");
            },

            filterCollection: function (value) {
                var resultCollection;
                var regex;

                regex = new RegExp(value, 'i');

                resultCollection = this.collection.filter(function (model) {
                    return model.get('name').match(regex);
                });

                return resultCollection;
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
                this.end = Math.min(this.currentPage * this.elementToShow, this.filteredCollection.length);

                var prevPage;
                var nextPage;
                var status = '';

                displayCollection = this.filteredCollection.toJSON();
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

                this.paginationBool = (this.filteredCollection.length > this.elementToShow) ? true : false;

                if (this.paginationBool) {
                    paginationLi.find('.counter').html((this.start + 1) + '-' + this.end + ' of ' + this.filteredCollection.length);
                    paginationLi.show();
                } else {
                    paginationLi.hide();
                }

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
                var currentEl = this.$el;
                var nameInput = currentEl.find(".filterName input");

                currentEl.append(this.template({
                    filterDisplayName: this.filterDisplayName,
                    status: this.status,
                    filterName: this.filterName,
                }));

                this.renderContent();

                currentEl.find("[id='" + this.filterName + "Values'] .miniStylePagination a").click(function (e) {
                    self.paginationChange(e, self);
                });

                nameInput.keyup(function (e) {
                    self.inputEvent(e)
                });

                nameInput.change(function (e) {
                    self.inputEvent(e)
                });

                currentEl.find('.ulContent').toggle();
            }
        });

        return filterValuesView;
    }
);