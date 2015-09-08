define([
        'text!templates/filter/filterBarTemplate.html',
        'views/filter/filterView',
        'collections/filter/filterCollection',
        'custom',
        'common',
        'constants'
    ],
    function (filterTemplate, valuesView, filterValuesCollection, Custom, Common, CONSTANTS) {
        var FilterView;
        FilterView = Backbone.View.extend({
            el: '#filterBar',
            contentType: "Filter",
            savedFilters: {},
            filterIcons: {},
            template: _.template(filterTemplate),
            filter: {},

            events: {
                'click .dropDown': 'showHideValues',
                "click .filterValues li": "selectValue",
            },

            initialize: function (options) {
                this.parentContentType = options.contentType;
                this.constantsObject = CONSTANTS.FILTERS[this.parentContentType];

                this.currentCollection = {};

                this.parseFilter();

                this.setDbOnce = _.debounce(
                    function () {
                        this.trigger('filter', this.filter)
                    }, 500);
            },

            selectValue: function (e) {
                var currentElement = $(e.target);
                var currentValue = currentElement.attr('data-value');
                var currentName = $.trim(currentElement.text());
                var filterContainerElement = currentElement.closest('.filterFullContainer');
                var filterNameElement = filterContainerElement.find('.filterName')
                var constantsName = filterNameElement.attr('data-value');
                var currentCollection = this.currentCollection[constantsName];
                var collectionElement;
                var intVal;
                var index;

                currentElement.toggleClass('checkedValue');

                intVal = parseInt(currentValue);

                currentValue = (isNaN(intVal) || currentValue.length === 24) ? currentValue : intVal;

                collectionElement = currentCollection.findWhere({_id: currentValue});

                if (currentElement.hasClass('checkedValue')) {

                    //if (!this.filter[constantsName]) {
                        this.filter[constantsName] = [];
                    //}

                    this.filter[constantsName].push(currentValue);
                    collectionElement.set({status: true});

                    filterNameElement.addClass('checkedGroup');
                    filterNameElement.find('input').val(currentName);

                } else {
                    index = this.filter[constantsName].indexOf(currentValue);

                    if (index >= 0) {
                        this.filter[constantsName].splice(index, 1);
                        collectionElement.set({status: false});

                        if (this.filter[constantsName].length === 0) {
                            delete this.filter[constantsName];
                            filterNameElement.removeClass('checkedGroup');

                            filterNameElement.find('input').val('');
                        }
                    }
                    ;
                }

                this.setDbOnce();
            },

            showHideValues: function (e) {
                var filterGroupContainer = $(e.target).closest('.filterFullContainer');

                filterGroupContainer.find('.ulContent').toggle();
                filterGroupContainer.toggleClass('activeGroup');
            },

            renderFilterElements: function () {
                var self = this;
                var keys = Object.keys(this.constantsObject);
                var containerString;
                var filterDisplayName;

                if (keys.length) {
                    keys.forEach(function (key) {
                        filterDisplayName = self.constantsObject[key].displayName;

                        containerString = '<div id="' + key + 'FilterContainer" class="filterFullContainer">';
                        containerString += '</div>';
                        self.$el.append(containerString);

                        self.renderFilter(key, filterDisplayName);
                    });
                };
            },

            renderFilter: function (key, filterDisplayName) {
                var itemView;
                var idString = '#' + key + 'FilterContainer';
                var container = this.$el.find(idString);
                var status;
                var self = this;

                if (!App.filterCollections || !App.filterCollections[key]) {
                    return setTimeout(function () {
                        self.renderFilter(key, filterDisplayName);
                    }, 10);
                }

                this.filterObject = App.filterCollections[key];

                this.currentCollection[key] = new filterValuesCollection(this.filterObject);

                if (this.filter[key]) {
                    this.setStatus(key);
                    status = true;
                } else {
                    status = false;
                }

                itemView = new valuesView({
                    element: idString,
                    status: status,
                    filterName: key,
                    filterDisplayName: filterDisplayName,
                    currentCollection: this.currentCollection[key]
                });

                container.html('');
                container.html(itemView.render());
            },

            render: function () {
                this.$el.append(this.template());
                this.renderFilterElements();

                return this;
            },

            parseFilter: function () {
                var browserString = window.location.hash;
                var browserFilter = browserString.split('/filter=')[1];

                App.filter = (browserFilter) ? JSON.parse(decodeURIComponent(browserFilter)) : {};
            },

            setStatus: function (filterKey) {
                var valuesArray;
                var collectionElement;

                valuesArray = this.filter[filterKey]['value'];

                for (var i = valuesArray.length - 1; i >= 0; i--) {
                    collectionElement = this.currentCollection[filterKey].findWhere({_id: valuesArray[i]});
                    collectionElement.set({status: true});
                }
            }
        });

        return FilterView;
    });