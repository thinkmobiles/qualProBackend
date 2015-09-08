/**
 * Created by Roman on 23.04.2015.
 */
define([], function () {
    var filters = {
        personnel: {
            country: {
                displayName: 'Country',
                child: 'outlet'
            },
            outlet: {
                displayName: 'Outlet',
                child: 'branch',
                parent: 'country'
            },
            branch: {
                displayName: 'Branch',
                child: 'branch',
                parent: 'country'
            }
        }
    };

    return {
        EMAIL_REGEXP: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

        ACTIVITYLIST: 'activityList',
        LOCATION: 'location',
        COUNTRY: 'country',
        OUTLETS: 'outlets',
        BRUNCHES: 'brunches',
        PERSONNEL: 'personnel',
        ASSIGNMENTS: 'assignments',
        OBJECTIVES: 'objectives',
        INSTORREPORTING: 'inStorReporting',
        CUSTOMREPORTS: 'customReports',
        EVENTS: 'events',
        ALALALIREPORTING: 'alalaliReporting',
        COMPETITORACTIVITY: 'competitorActivity',
        COMPETITORLIST: 'competitorList',
        PLANOGRAM: 'planogram',
        SHELFSHARES: 'shelfShares',
        ITEMS: 'Items',
        ITEMSLIST: 'itemsList',
        PRICELIST: 'priceList',
        CONTRACTS: 'contracts',

        FILTERS: filters,
        FILTERVALUESCOUNT: 2
    }
});