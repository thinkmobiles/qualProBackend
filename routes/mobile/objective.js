var express = require('express');
var router = express.Router();

/**
 * @module Mobile - Outlet
 */

var Handler = require('../../handlers/objective');
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
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/objective`
     *
     * Returns the all existing `objective`
     * @see {@link ObjectiveModel}
     * @returns {ObjectiveModel[]}
     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/objective'
     * RESPONSE
     *     [{
     *         "_id" : "55eeb7b58f9c1deb19000009"
     *         "name" : "some objective",
     *         "description" : "emptyObjective",
     *         "outlet" : "55eeb7b58f9c1deb19000002",
     *         "manager" : "55eeb7b58f9c1deb19054321",
     *         "whoCanRW" : "everyOne",
     *         "isArchived" : false,
     *         "parent" : "55eeb7b58f9acbeb19054321",
     *         "children" : ["55eeb7b58f9acbeb19054925", ...],
     *         "date" : "2015-09-08T10:25:57.175Z",
     *         "status" : "55eeb7b58f9c1deb19054765",
     *         "assignment" : "55eeb7b58f9c1deb67054321",
     *         "currentProgress" : "100",
     *         "creationDate" : "2015-09-09T12:40:15.388Z",
     *         "editedBy" : {
     *             "date" : "2015-09-08T10:25:57.175Z",
     *             "user" : null
     *         },
     *         "createdBy" : {
     *             "date" : "2015-09-08T10:25:57.175Z",
     *             "user" : null
     *         },
     *         "comments" : ["55eeb7b58f9a6beb19054925", ...]
     *      }, ...]
     * @method /country
     * @instance
     */
    router.get('/', handler.getAll);

    /**
     * __Type__ `GET`
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/objective`
     *
     * Returns existing `objective` with requested id
     * @see {@link ObjectiveModel}
     * @returns {ObjectiveModel}
     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/objective/55eeb7b58f9c1deb19000002'
     * RESPONSE
     *     {
     *         "_id" : "55eeb7b58f9c1deb19000002"
     *         "name" : "some objective",
     *         "description" : "emptyObjective",
     *         "outlet" : "55eeb7b58f9c1deb19000002",
     *         "manager" : "55eeb7b58f9c1deb19054321",
     *         "whoCanRW" : "everyOne",
     *         "isArchived" : false,
     *         "parent" : "55eeb7b58f9acbeb19054321",
     *         "children" : ["55eeb7b58f9acbeb19054925", ...],
     *         "date" : "2015-09-08T10:25:57.175Z",
     *         "status" : "55eeb7b58f9c1deb19054765",
     *         "assignment" : "55eeb7b58f9c1deb67054321",
     *         "currentProgress" : "100",
     *         "creationDate" : "2015-09-09T12:40:15.388Z",
     *         "editedBy" : {
     *             "date" : "2015-09-08T10:25:57.175Z",
     *             "user" : null
     *         },
     *         "createdBy" : {
     *             "date" : "2015-09-08T10:25:57.175Z",
     *             "user" : null
     *         },
     *         "comments" : ["55eeb7b58f9a6beb19054925", ...]
     *      }
     * @method /country/:id
     * @instance
     */
    router.get('/:id', handler.getById);

    /**
     * __Type__ `POST`
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/objective`
     *
     * Creates new objective. Put objective in body.
     * @see {@link ObjectiveModel}
     * @returns { _id}
     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/objective'
     * BODY
     *     {
     *         "name" : "some objective",
     *         "description" : "emptyObjective",
     *         "outlet" : "55eeb7b58f9c1deb19000002",
     *         "manager" : "55eeb7b58f9c1deb19054321",
     *         "whoCanRW" : "everyOne",
     *         "isArchived" : false,
     *         "parent" : "55eeb7b58f9acbeb19054321",
     *         "children" : ["55eeb7b58f9acbeb19054925", ...],
     *         "date" : "2015-09-08T10:25:57.175Z",
     *         "status" : "55eeb7b58f9c1deb19054765",
     *         "assignment" : "55eeb7b58f9c1deb67054321",
     *         "currentProgress" : "100",
     *         "comments" : []
     *      }
     * RESPONSE
     *      {
     *         "_id" : "55eeb7b58f9c1deb19000009"
     *      }
     * @method /objective
     * @instance
     */
    router.post('/', handler.create);

    /**
     * __Type__ `PUT`
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/objective`
     *
     *
     * Updated objective with specific id. Put into body all model properties
     * @see {@link ObjectiveModel}

     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/objective/55eeb7b58f9c1deb19000009'
     BODY
     *   {
     *         "name" : "another objective",
     *         "description" : "emptyObjective",
     *         "outlet" : "55eeb7b58f9c1deb19000002",
     *         "manager" : "55eeb7b58f9c1deb19054321",
     *         "whoCanRW" : "everyOne",
     *         "isArchived" : false,
     *         "parent" : "55eeb7b58f9acbeb19054321",
     *         "children" : ["55eeb7b58f9acbeb19054925", ...],
     *         "date" : "2015-09-08T10:25:57.175Z",
     *         "status" : "55eeb7b58f9c1deb19054765",
     *         "assignment" : "55eeb7b58f9c1deb67054321",
     *         "currentProgress" : "100",
     *         "comments" : []
     *      }
     * RESPONSE status
     * @method /objective/:id
     * @instance
     */
    router.put('/:id', handler.update);

    /**
     * __Type__ `PATCH`
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/objective`
     *
     * Updated objective with specific id. Put into body only properties to update
     * @see {@link ObjectiveModel}

     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/objective/55eeb7b58f9c1deb19000009'
     * BODY
     *     {
     *          "name" : "another objective"
     *     }
     * RESPONSE status
     * @method /objective/:id
     * @instance
     */
    router.patch('/:id', handler.update);

    return router;
};