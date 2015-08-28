var express = require('express');
var router = express.Router();
var PersonnelHandler = require('../handlers/personnel');

module.exports = function (models) {
    var handler = new PersonnelHandler(models);

    //router.get('/', handler.getAll);
    //router.get('/:id',handler.getById);
    router.post('/',handler.registration);
    //router.put('/:id',handler.update);
    return router;
};