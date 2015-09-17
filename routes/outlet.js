var express = require('express');
var router = express.Router();

var Handler = require('../handlers/outlet');
module.exports = function (db, event) {
    var handler = new Handler(db, event);

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
    router.post('/getBy/', checkAuth, handler.getBy);
    router.put('/:id', handler.update);
    router.delete('/:id', checkAuth, handler.remove);
    return router;
};