var express = require('express');
var router = express.Router();

var Handler = require('../../handlers/outlet');
module.exports = function (db) {
    var handler = new Handler(db);

    function checkAuth(req, res, next) {
        if (req.session && req.session.loggedIn) {
            next();
        } else {
            res.send(401);
        }
    }

    /**
     * __Type__ `GET`
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/outlet`
     *
     * Returns the all existing `outlet`
     * @see {@link OutletModel}
     * @returns {OutletModel[]}
     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/outlet'
     * RESPONSE
     *     [{
     *         "_id" : "55eeb7b58f9c1deb19000009"
     *         "name" : "some outlet",
     *         "description" : "emptyOutlet",
     *         "country" : "55eeb7b58f9c1deb19000002",
     *         "manager" : "55eeb7b58f9c1deb19054321",
     *         "branches" : ["55eeb7b58f9acbeb19054925", ...],
     *         "imageSrc" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAA...
     *         "isOwn" : "true"
     *         "isArchived" : false,
     *         "editedBy" : {
     *             "date" : "2015-09-08T10:25:57.175Z",
     *             "user" : null
     *         },
     *         "createdBy" : {
     *             "date" : "2015-09-08T10:25:57.175Z",
     *             "user" : null
     *         },

     *      }, ...]
     * @method /country
     * @instance
     */
    router.get('/', handler.getAll);

    /**
     * __Type__ `GET`
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/outlet`
     *
     * Returns existing `outlet` with requested id
     * @see {@link OutletModel}
     * @returns {OutletModel}
     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/outlet/55eeb7b58f9c1deb19000002'
     * RESPONSE
     *     {
     *         "_id" : "55eeb7b58f9c1deb19000009"
     *         "name" : "some outlet",
     *         "description" : "emptyOutlet",
     *         "country" : "55eeb7b58f9c1deb19000002",
     *         "manager" : "55eeb7b58f9c1deb19054321",
     *         "branches" : ["55eeb7b58f9acbeb19054925", ...],
     *         "imageSrc" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAA...
     *         "isOwn" : "true"
     *         "isArchived" : false,
     *         "editedBy" : {
     *             "date" : "2015-09-08T10:25:57.175Z",
     *             "user" : null
     *         },
     *         "createdBy" : {
     *             "date" : "2015-09-08T10:25:57.175Z",
     *             "user" : null
     *         },
     *
     *      }
     * @method /country/:id
     * @instance
     */
    router.get('/:id', handler.getById);

    /**
     * __Type__ `POST`
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/outlet`
     *
     * Creates new outlet. Put outlet in body.
     * @see {@link OutletModel}
     * @returns { _id}
     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/outlet'
     * BODY
     *    {
     *         "name" : "some outlet",
     *         "description" : "emptyOutlet",
     *         "country" : "55eeb7b58f9c1deb19000002",
     *         "manager" : "55eeb7b58f9c1deb19054321",
     *         "branches" : ["55eeb7b58f9acbeb19054925", ...],
     *         "imageSrc" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAA...
     *         "isOwn" : "true"
     *         "isArchived" : false,
     *      }
     * RESPONSE
     *      {
     *         "_id" : "55eeb7b58f9c1deb19000009"
     *      }
     * @method /outlet
     * @instance
     */
    router.post('/', handler.create);

    /**
     * __Type__ `PUT`
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/outlet`
     *
     *
     * Updated outlet with specific id. Put into body all model properties
     * @see {@link OutletModel}

     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/outlet/55eeb7b58f9c1deb19000009'
     BODY
     *      {
     *         "name" : "some outlet",
     *         "description" : "emptyOutlet",
     *         "country" : "55eeb7b58f9c1deb19000002",
     *         "manager" : "55eeb7b58f9c1deb19054321",
     *         "branches" : ["55eeb7b58f9acbeb19054925", ...],
     *         "imageSrc" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAA...
     *         "isOwn" : "true"
     *         "isArchived" : false,
     *      }
     * RESPONSE status
     * @method /outlet/:id
     * @instance
     */
    router.put('/:id', handler.update);

    /**
     * __Type__ `PATCH`
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/outlet`
     *
     * Updated outlet with specific id. Put into body only properties to update
     * @see {@link OutletModel}

     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/outlet/55eeb7b58f9c1deb19000009'
     * BODY
     *     {
     *          "name" : "another outlet"
     *     }
     * RESPONSE status
     * @method /outlet/:id
     * @instance
     */
    router.patch('/:id', handler.update);

    return router;
};