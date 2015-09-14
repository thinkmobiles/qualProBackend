var express = require('express');
var router = express.Router();
var PersonnelHandler = require('../handlers/personnel')
//var personnelRouter = require('./mobile/personnel');
//var branchRouter = require('./mobile/branch');
//var categoryRouter = require('./mobile/category');
//var commentRouter = require('./mobile/comment');
//var contractRouter = require('./mobile/contract');
//var countryRouter = require('./mobile/country');
//var itemRouter = require('./mobile/item');
//var noteRouter = require('./mobile/note');
//var objectiveRouter = require('./mobile/objective');
//var outletRouter = require('./mobile/outlet');
//var positionRouter = require('./mobile/position');
//var priorityRouter = require('./mobile/priority');
//var shelfRouter = require('./mobile/shelf');
//var taskRouter = require('./mobile/task');

/**
 * @module Mobile - Login
 */

module.exports = function (db) {
    var personnelHandler=new PersonnelHandler(db);
    var routes = {
        "personnel": require('./mobile/personnel')(db),
        "branch": require('./mobile/branch')(db),
        "category": require('./mobile/category')(db),
        "comment": require('./mobile/comment')(db),
        "contract": require('./mobile/contract')(db),
        "country": require('./mobile/country')(db),
        "item": require('./mobile/item')(db),
        "note": require('./mobile/note')(db),
        "objective": require('./mobile/objective')(db),
        "outlet": require('./mobile/outlet')(db),
        "position": require('./mobile/position')(db),
        "priority": require('./mobile/priority')(db),
        "shelf": require('./mobile/shelf')(db),
        "task": require('./mobile/task')(db)
    }

    function checkAuth(req, res, next) {
        if (req.session && req.session.loggedIn) {
            next();
        } else {
            res.send(401);
        }
    }

    for (var route in routes) {
        router.use('/' + route, checkAuth, routes[route])
    }
    /**
     * __Type__ 'POST'
     *
     * Base ___url___ for build __requests__ is `http:/<host>:<port>/mobile/login`
     *
     * Logs into system
     *
     *
     * @example
     * REQUEST:
     *     'http://localhost:9797/mobile/personnel/login'
     * BODY:
     * {
     *      email:'somebody@mail.com'
     *      pass:'iddqd'
     * }
     * RESPONSE : status
     *
     * @method /mobile/login
     * @instance
     */
    router.post('/login', personnelHandler.login);
    return router;
};