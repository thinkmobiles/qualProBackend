var express = require('express');
var router = express.Router();
var personnelHandler = require('../handlers/personnel');

module.exports = function (db) {
    var handler = new personnelHandler(db);

    router.get('/', handler.getAll);
    router.get('/:id', handler.getById);
    router.post('/passwordChange/:forgotToken', handler.changePassword);
    router.post('/forgotPass', handler.forgotPassword);
    router.get('/confirm/:token',handler.confirm);
    router.post('/', handler.create);
    router.put('/:id', handler.update);
    router.delete('/:id', handler.remove);
    return router;
};