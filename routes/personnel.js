var express = require('express');
var router = express.Router();
var PersonnelHandler = require('../handlers/personnel');

module.exports = function (db) {
    var handler = new PersonnelHandler(db);

    //router.get('/', handler.getAll);
    //router.get('/:id', handler.getById);
    router.post('/', handler.create);
    router.delete('/:id', handler.remove);
    //router.put('/:id', handler.update);
    return router;
};