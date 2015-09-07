var express = require('express');
var router = express.Router();
var personnelHandler = require('../handlers/personnel');

module.exports = function (db, app) {
    var handler = new personnelHandler(db);
    var csrfProtection = app.get('csrfProtection');

    router.get('/', handler.getAll);
    router.get('/currentUser', handler.getById);
    router.get('/:id', handler.getById);
    router.post('/passwordChange/:forgotToken', csrfProtection, handler.changePassword);
    router.post('/forgotPass', csrfProtection, handler.forgotPassword);
    router.get('/confirm/:token',handler.confirm);
    router.post('/', handler.create);
    router.put('/:id', handler.update);
    router.patch('/:id', handler.update);
    router.delete('/:id', handler.remove);

    return router;
};