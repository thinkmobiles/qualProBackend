var express = require('express');
var router = express.Router();

var Handler = require('../handlers/contract');
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
    router.get('/:id', checkAuth, handler.getById);
    router.post('/', checkAuth, handler.create);
    router.put('/:id', handler.update);
    router.delete('/:id', checkAuth, handler.remove);
    return router;
};