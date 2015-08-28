var express = require('express');
var router = express.Router();
var personnelHandler = require('../handlers/personnel');

module.exports = function (models) {
    var handler = new personnelHandler(models);

    router.get('/currentUser', handler.currentUser);

    return router;
};