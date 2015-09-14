var express = require('express');
var router = express.Router();

/**
 * @module Mobile - Country
 */

var Handler = require('../handlers/country');
module.exports = function (db) {
    var handler = new Handler(db);

    /**
     * __Type__ `GET`
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/country`
     *
     * Returns the all existing `country`
     * @see {@link CountryModel}
     * @returns {CountryModel[]}
     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/country'
     * RESPONSE
     *     [{
     *         _id: "55eeb7b58f9c1deb19000002",
     *         creationDate: "2015-09-09T12:40:15.388Z",
     *         editedBy: {
     *             date: "2015-09-08T10:25:57.175Z",
     *             user: null
     *         },
     *         createdBy: {
     *             date: "2015-09-08T10:25:57.175Z",
     *             user: null
     *         },
     *         description: "The only shield that protects you from Sauron",
     *         manager: null,
     *         personnels: [],
     *         outlets: [],
     *         isArchived: false,
     *         name: "Gondor",
     *         imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAA...
     *      }, ...]
     * @method /country
     * @instance
     */
    router.get('/', handler.getAll);

    /**
     * __Type__ `GET`
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/country`
     *
     * Returns existing `country` with requested id
     * @see {@link CountryModel}
     * @returns {CountryModel}
     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/country/55eeb7b58f9c1deb19000002'
     * RESPONSE
     *     {
     *         _id: "55eeb7b58f9c1deb19000002",
     *         creationDate: "2015-09-09T12:40:15.388Z",
     *         editedBy: {
     *             date: "2015-09-08T10:25:57.175Z",
     *             user: null
     *         },
     *         createdBy: {
     *             date: "2015-09-08T10:25:57.175Z",
     *             user: null
     *         },
     *         description: "The only shield that protects you from Sauron",
     *         manager: null,
     *         personnels: [],
     *         outlets: [],
     *         isArchived: false,
     *         name: "Gondor",
     *         imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAA...
     *      }
     * @method /country/:id
     * @instance
     */
    router.get('/:id', handler.getById);

    /**
     * __Type__ `POST`
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/country`
     *
     * Creates new country. Put country in body. Date in format YYYY/MM/DD or YYYY-MM-DD
     * @see {@link CountryModel}
     * @returns { _id}
     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/country/'
     * BODY
     *     {
     *        description: "The only shield that protects you from Sauron",
     *         manager: null,
     *         personnels: [],
     *         outlets: [],
     *         isArchived: false,
     *         name: "Gondor",
     *         imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAA...
     *      }
     * RESPONSE
     *      {
     *         _id: "55eeb7b58f9c1deb19000009"
     *      }
     * @method /country
     * @instance
     */
    router.post('/', handler.create);

    /**
     * __Type__ `PUT`
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/country`
     *
     *
     * Updated country with specific id. Put into body all model properties
     * @see {@link CountryModel}

     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/country/'
     * BODY
     *     {
     *        description: "The only shield that protects you from Sauron",
     *         manager: null,
     *         personnels: [],
     *         outlets: [],
     *         isArchived: false,
     *         name: "Gondor",
     *         imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAA...
     *      }
     * RESPONSE status
     * @method /country/:id
     * @instance
     */
    router.put('/:id', handler.update);

    /**
     * __Type__ `PATCH`
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/country`
     *
     * Updated country with specific id. Put into body only properties to update
     * @see {@link CountryModel}

     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/country/'
     * BODY
     *     {
     *         imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAA...
     *     }
     * RESPONSE status
     * @method /country/:id
     * @instance
     */
    router.patch('/:id', handler.update);

    return router;
};
