var express = require('express');
var router = express.Router();

var Handler = require('../../handlers/branch');

/**
 * @module Mobile - Branch
 */

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
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/branch`
     *
     * Returns the all existing `branch`
     * @see {@link BranchModel}
     * @returns {BranchModel[]}
     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/branch'
     * RESPONSE
     *     [{
     *         "name" : "some branch",
     *         "outlet" : "55eeb7b58f9c1deb19000002"
     *         "manager" : "55eeb7b58f9c1deb19054321"
     *         "creationDate" : "2015-09-09T12:40:15.388Z",
     *         "editedBy" : {
     *             "date" : "2015-09-08T10:25:57.175Z",
     *             "user" : null
     *         },
     *         "createdBy" : {
     *             "date" : "2015-09-08T10:25:57.175Z",
     *             "user" : null
     *         },
     *         "description" : "The only shield that protects you from Sauron",
     *         "isArchived" : false,
     *         "imageSrc" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAA...
     *      }, ...]
     * @method /country
     * @instance
     */
    router.get('/', handler.getAll);

    /**
     * __Type__ `GET`
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/branch`
     *
     * Returns existing `branch` with requested id
     * @see {@link BranchModel}
     * @returns {BranchModel}
     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/branch/55eeb7b58f9c1deb19000002'
     * RESPONSE
     *     {
     *         "name" : "some branch",
     *         "outlet" : "55eeb7b58f9c1deb19000002"
     *         "manager" : "55eeb7b58f9c1deb19054321"
     *         "creationDate" : "2015-09-09T12:40:15.388Z",
     *         "editedBy" : {
     *             "date" : "2015-09-08T10:25:57.175Z",
     *             "user" : null
     *         },
     *         "createdBy" : {
     *             "date" : "2015-09-08T10:25:57.175Z",
     *             "user" : null
     *         },
     *         "description" : "The only shield that protects you from Sauron",
     *         "isArchived" : false,
     *         "imageSrc" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAA...
     *      }
     * @method /country/:id
     * @instance
     */
    router.get('/:id', handler.getById);

    /**
     * __Type__ `POST`
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/branch`
     *
     * Creates new branch. Put branch in body.
     * @see {@link BranchModel}
     * @returns { _id}
     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/branch'
     * BODY
     *     {
     *         "name" : "some branch",
     *         "outlet" : "55eeb7b58f9c1deb19000002"
     *         "manager" : "55eeb7b58f9c1deb19054321"
     *         "description" : "The only shield that protects you from Sauron",
     *         "isArchived" : false,
     *         "imageSrc" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAA...
     *      }
     * RESPONSE
     *      {
     *         "_id" : "55eeb7b58f9c1deb19000009"
     *      }
     * @method /branch
     * @instance
     */
    router.post('/', handler.create);

    /**
     * __Type__ `PUT`
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/branch`
     *
     *
     * Updated branch with specific id. Put into body all model properties
     * @see {@link BranchModel}

     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/branch/55eeb7b58f9c1deb19000009'
     BODY
     *    {
     *         "name" : "some branch",
     *         "outlet" : "55eeb7b58f9c1deb19000002"
     *         "manager" : "55eeb7b58f9c1deb19054321"
     *         "description" : "The only shield that protects you from Sauron",
     *         "isArchived" : false,
     *         "imageSrc" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAA...
     *      }
     * RESPONSE status
     * @method /branch/:id
     * @instance
     */
    router.put('/:id', handler.update);

    /**
     * __Type__ `PATCH`
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/branch`
     *
     * Updated branch with specific id. Put into body only properties to update
     * @see {@link BranchModel}

     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/branch/55eeb7b58f9c1deb19000009'
     * BODY
     *     {
     *         "imageSrc" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAA...
     *     }
     * RESPONSE status
     * @method /branch/:id
     * @instance
     */
    router.patch('/:id', handler.update);

    return router;
};