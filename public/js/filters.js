define(['constants'], function (CONSTANTS) {
    var filters = {};
    var personnelFilter = {};

    var personnelConstant = CONSTANTS.PERSONNEL;
    var countryConstant = CONSTANTS.COUNTRY;
    var outletConstant = CONSTANTS.OUTLET;
    var branchConstant = CONSTANTS.BRANCH;

    var country = {
        displayName: 'Country',
        type: 'ObjectId',
    };

    var outlet = {
        displayName: 'Outlet',
        type: 'ObjectId',
    };

    var branch = {
        displayName: 'Branch',
        type: 'ObjectId',
    };

    personnelFilter[countryConstant] = country;
    personnelFilter[countryConstant].child = outletConstant;

    personnelFilter[outletConstant] = outlet;
    personnelFilter[outletConstant].child = branchConstant;
    personnelFilter[outletConstant].parent = countryConstant;

    personnelFilter[branchConstant] = branch;
    personnelFilter[branchConstant].parent = outletConstant;

    filters[personnelConstant] = personnelFilter;

    return {
        FILTERS: filters,
        FILTERVALUESCOUNT: 7
    }
});