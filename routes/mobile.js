var express = require('express');
var router = express.Router();
var PersonnelHandler = require('../handlers/personnel')

/**
 * @module Mobile - Login
 */

module.exports = function (db) {
	var personnelHandler = new PersonnelHandler(db);
	var routes = {
		"personnel": require('./mobile/personnel')(db),
		"branch"   : require('./mobile/branch')(db),
		"category" : require('./mobile/category')(db),
		"comment"  : require('./mobile/comment')(db),
		"contract" : require('./mobile/contract')(db),
		"country"  : require('./mobile/country')(db),
		"item"     : require('./mobile/item')(db),
		"note"     : require('./mobile/note')(db),
		"objective": require('./mobile/objective')(db),
		"outlet"   : require('./mobile/outlet')(db),
		"position" : require('./mobile/position')(db),
		"priority" : require('./mobile/priority')(db),
		"shelf"    : require('./mobile/shelf')(db),
		"task"     : require('./mobile/task')(db)
	};

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