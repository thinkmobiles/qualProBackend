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
                'click .groupName': 'showHideValues',
                "click .filterValues li": "selectValue"
            },

            initialize: function (options) {
                this.parentContentType = options.contentType;
                this.constantsObject = CONSTANTS.FILTERS[this.parentContentType];

                this.currentCollection = {};

                this.parseFilter();

                this.setDbOnce = _.debounce(
                    function () {
                        this.trigger('filter', App.filter)
                    }, 500);
            },

            selectValue: function (e) {
                var currentElement = $(e.target);
                var currentValue = currentElement.attr('data-value');
                var filterGroupElement = currentElement.closest('.filterGroup');
                var groupType = filterGroupElement.attr('data-value');
                var groupNameElement = filterGroupElement.find('.groupName')
                var constantsName = $.trim(groupNameElement.text());
                var filterObjectName = this.constantsObject[constantsName].view;
                var currentCollection = this.currentCollection[filterObjectName];
                var collectionElement;
                var intVal;
                var index;

                currentElement.toggleClass('checkedValue');

                intVal = parseInt(currentValue);

                currentValue = (isNaN(intVal) || currentValue.length === 24) ? currentValue : intVal;

                collectionElement = currentCollection.findWhere({_id: currentValue});

                if (currentElement.hasClass('checkedValue')) {

                    if (!App.filter[filterObjectName]) {
                        App.filter[filterObjectName] = {
                            key: groupType,
                            value: []
                        };
                    }

                    App.filter[filterObjectName]['value'].push(currentValue);
                    collectionElement.set({status: true});

                    groupNameElement.addClass('checkedGroup');

                } else {
                    index = App.filter[filterObjectName]['value'].indexOf(currentValue);

                    if (index >= 0) {
                        App.filter[filterObjectName]['value'].splice(index, 1);
                        collectionElement.set({status: false});

                        if (App.filter[filterObjectName]['value'].length === 0) {
                            delete App.filter[filterObjectName];
                            groupNameElement.removeClass('checkedGroup');
                        }
                    }
                    ;
                }

                this.setDbOnce();
            },

            showHideValues: function (e) {
                var filterGroupContainer = $(e.target).closest('.filterGroup');

                filterGroupContainer.find('.ulContent').toggle()
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

                        containerString = '<div id="' + key + 'FilterContainer">';
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
                        self.renderGroup(key, filterDisplayName);
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