var express = require('express');
var router = express.Router();

var Handler = require('../handlers/branch');

/**
 * dgfghtfhf
 * @param db
 * @returns {*|{prototype}}
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

    router.get('/', checkAuth, handler.getAll);
    router.get('/getForDD',checkAuth,handler.getForDD);
    router.get('/:id', checkAuth, handler.getById);
    router.post('/', checkAuth, handler.create);
    router.put('/:id', handler.update);
    router.patch('/:id', handler.update);
    router.delete('/:id', checkAuth, handler.remove);
    return router;
};