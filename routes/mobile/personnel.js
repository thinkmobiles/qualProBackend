var express = require('express');
var router = express.Router();
var personnelHandler = require('../../handlers/personnel');

/**
 * @module Mobile - Personnel
 */

module.exports = function (db) {
    var handler = new personnelHandler(db);

    /**
     * __Type__ `GET`
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/personnel`
     *
     * Returns the all existing `personnel`
     * @see {@link PersonnelModel}
     * @returns {PersonnelModel[]}
     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/personnel'
     * RESPONSE
     *     [{
     *         _id: "55eeb7b58f9c1deb19000002",
     *         dateBirth: "1997-07-03T00:00:00.000Z",
     *         __v: 0,
     *         lastAccess: "2015-09-09T12:40:15.388Z",
     *         editedBy: {
     *             date: "2015-09-08T10:25:57.175Z",
     *             user: null
     *         },
     *         createdBy: {
     *             date: "2015-09-08T10:25:57.175Z",
     *             user: null
     *         },
     *         description: "Super Admin created auto",
     *         groups: {
     *             group: [ ],
     *             users: [ ],
     *             owner: null
     *         },
     *         whoCanRW: "everyOne",
     *         position: 0,
     *         manager: null,
     *         phoneNumber: "",
     *         email: "admin@admin.com",
     *         country: null,
     *         lastName: "Pupkin",
     *         firstName: "Vasya",
     *         imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAA...
     *         fullName: "Vasya Pupkin"
     *      }, ...]
     * @method /personnel
     * @instance
     */
    router.get('/', handler.getAll);
    router.get('/currentUser', handler.getById);

    /**
     * __Type__ 'GET'
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/personnel`
     *
     * Returns existing `personnel` with requested id
     * @see {@link PersonnelModel}
     * @returns {PersonnelModel}
     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/personnel/55eeb7b58f9c1deb19000002'
     * RESPONSE
     *     [{
     *         _id: "55eeb7b58f9c1deb19000002",
     *         dateBirth: "1997-07-03T00:00:00.000Z",
     *         __v: 0,
     *         lastAccess: "2015-09-09T12:40:15.388Z",
     *         editedBy: {
     *             date: "2015-09-08T10:25:57.175Z",
     *             user: null
     *         },
     *         createdBy: {
     *             date: "2015-09-08T10:25:57.175Z",
     *             user: null
     *         },
     *         description: "Super Admin created auto",
     *         groups: {
     *             group: [ ],
     *             users: [ ],
     *             owner: null
     *         },
     *         whoCanRW: "everyOne",
     *         position: 0,
     *         manager: null,
     *         phoneNumber: "",
     *         email: "admin@admin.com",
     *         country: null,
     *         lastName: "Pupkin",
     *         firstName: "Vasya",
     *         imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAA...
     *         fullName: "Vasya Pupkin"
     *      }, ...]
     * @method /personnel/:id
     * @instance
     */
    router.get('/:id', handler.getById);

    /**
     * __Type__ 'POST'
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/personnel`
     *
     * Searches for user with specific email end send him/her mail with istructions of reseting password
     *
     *
     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/personnel/forgotPass'
     * BODY:
     * {
     *      email:'somebody@mail.com'
     * }
     * RESPONSE : status
     *
     * @method /personnel/forgotPass
     * @instance
     */
    router.post('/forgotPass', handler.forgotPassword);

    /**
     * __Type__ 'POST'
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/personnel`
     *
     * Creates new personnel. Put personnel in body. Date in format YYYY/MM/DD or YYYY-MM-DD
     *
     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/personnel/'
     * BODY:
     * {
     *   imageSrc : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAA...
     *   firstName : "Somebody",
     *   lastName : "Familyname",
     *   country : "55eeb7b58f9c1deb19000002",
     *   email : "someemail@mail.com",
     *   phoneNumber : "98345873458",
     *   manager : "55eeb7b58f9c1deb19000002",
     *   position : 12,
     *   dateBirth : "1934/07/24",
     *   description : "Really great guy"
     * }
     * RESPONSE :
     * {
     *   _id : "55eeb7b58f9c1deb19000008"
     * }
     *
     * @method /personnel/create
     * @instance
     */
    router.post('/', handler.create);

    /**
     * __Type__ 'PUT'
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/personnel`
     *
     * Updated personnel with specific id. Put into body all model properties
     *
     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/personnel/55eeb7b58f9c1deb19000005'
     * BODY:
     * {
     *   imageSrc : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAA...
     *   firstName : "Strangeguy",
     *   lastName : "Familyname",
     *   country : "55eeb7b58f9c1deb19000002",
     *   email : "someemail@mail.com",
     *   phoneNumber : "9834577458",
     *   manager : "55eeb7b58f9c1deb19000002",
     *   position : 12,
     *   dateBirth : "1934/07/24",
     *   description : "Really great guy"
     * }
     * RESPONSE : status
     *
     * @method /personnel/:id
     * @instance
     */
    router.put('/:id', handler.update);

    /**
     * __Type__ 'PATCH'
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/personnel/`
     *
     * Updated personnel with specific id. Put into body only properties to update
     *
     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/personnel/55eeb7b58f9c1deb19000005'
     * BODY:
     * {
     *   firstName : "Strangeguy",
     *   phoneNumber : "98347773458"
     * }
     * RESPONSE : status
     *
     * @method /personnel/:id
     * @instance
     */
    router.patch('/:id', handler.update);

    return router;
};