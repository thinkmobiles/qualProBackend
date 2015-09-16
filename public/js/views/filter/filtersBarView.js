define([
        'views/filter/filterView',
        'collections/filter/filterCollection',
        'custom',
        'common',
        'filters'
    ],
    function (valuesView, filterValuesCollection, Custom, Common, FILTERSCONSTANTS) {
        var FilterView;
        FilterView = Backbone.View.extend({
            el: '#filtersFullHolder',
            contentType: "Filter",
            savedFilters: {},
            filterIcons: {},
            filter: {},

            events: {
                'click .dropDown': 'showHideValues',
                'click .filterValues li': 'selectValue',
            },

            initialize: function (options) {
                this.parentContentType = options.contentType;
                this.constantsObject = FILTERSCONSTANTS.FILTERS[this.parentContentType];

                this.currentCollection = {};

                this.parseFilter();

                this.useFilterEvent = _.debounce(
                    function () {
                        this.trigger('filter', this.filter)
                    }, 500);

                this.inputEvent = _.debounce(
                    function (e) {
                        var target = e.target;
                        var value = target.value;

                        this.collection = this.collection.getSearchedCollection('fullName', value);

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
                var filterType = this.constantsObject[constantsName].type;
                var collectionElement;
                var intVal;
                var index;

                //currentElement.toggleClass('checkedValue'); /*For multiSelect*/

                intVal = parseInt(currentValue);

                currentValue = (isNaN(intVal) || currentValue.length === 24) ? currentValue : intVal;

                collectionElement = currentCollection.findWhere({_id: currentValue});

                //if (currentElement.hasClass('checkedValue')) {

                    //if (!this.filter[constantsName]) {
                        this.filter[constantsName] = {
                            type: filterType,
                            values: [],
                        };
                    //}

                    this.filter[constantsName].values.push(currentValue);
                    collectionElement.set({status: true});

                    filterNameElement.addClass('checkedGroup');
                    filterNameElement.find('input').val(currentName);

                /*} else {
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
                }*/

                this.useFilterEvent();
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