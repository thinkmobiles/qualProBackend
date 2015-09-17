var express = require('express');
var router = express.Router();

var Handler = require('../handlers/country');
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
    router.get('/getForDD', checkAuth, handler.getForDD);
    router.get('/:id', checkAuth, handler.getById);
    router.post('/', checkAuth, handler.create);
    router.post('/getBy', handler.getBy);
    router.put('/:id', handler.update);
    router.get('/archive/:id',handler.archive);
    router.delete('/:id', checkAuth, handler.remove);

    return router;
};
