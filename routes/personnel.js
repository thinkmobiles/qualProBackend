var express = require('express');
var router = express.Router();
var personnelHandler = require('../handlers/personnel');

module.exports = function (models) {
    var handler = new personnelHandler(models);

   // router.get('/', handler.getAll);
  //  router.get('/:id', handler.getById);
    router.post('/forgotPass', handler.forgotPassword);
    router.post('/', handler.create);
    router.put('/:id', handler.update);
    router.delete('/:id', handler.remove);
    return router;
};