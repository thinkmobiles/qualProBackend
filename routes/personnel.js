var express = require('express');
var router = express.Router();
var personnelHandler = require('../handlers/personnel');

/**
 * @module Personnel
 */

module.exports = function (db, app) {
    var handler = new personnelHandler(db);
    var csrfProtection = app.get('csrfProtection');

    /**
     * __Type__ `GET`
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/personnel`
     *
     * Returns the all existing `personnel`
     * @see {@link PersonnelModel}
     * @returns {PersonnelModel[]}
     * @example
     * REQUEST:
     *     'http://localhost:9797/personnel'
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
     *         fullName: "Vasya Pupkin",
     *      }, ...]
     * @method /personnel
     * @instance
     */
    router.get('/', handler.getAll);
    router.get('/currentUser', handler.getById);
    router.get('/:id', handler.getById);
    router.post('/passwordChange/:forgotToken', csrfProtection, handler.changePassword);
    router.post('/forgotPass', csrfProtection, handler.forgotPassword);
    router.get('/confirm/:token',handler.confirm);
    router.post('/', handler.create);
    router.put('/:id', handler.update);
    router.patch('/:id', handler.update);
    router.delete('/:id', handler.remove);

    return router;
};