var express = require('express');
var router = express.Router();
var UserHandler = require('../handlers/user');

module.exports = function (models) {
    var handler = new UserHandler(models);

    router.get('/currentUser', handler.currentUser);

    return router;
};