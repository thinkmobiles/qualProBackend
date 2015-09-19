/**
 * @see {@link https://nodejs.org/api/events.html}
 * @class EventEmiter
 */

module.exports = function (app, db) {
	var Events = require('events');
	var path = require('path');
	var event = new Events.EventEmitter();
	var logWriter = require('../helpers/logWriter');
	var fs = require("fs");
	var multipart = require('connect-multiparty');
	var multipartMiddleware = multipart();
	var mongoose = require('mongoose');

	var csurf = require('csurf');
	var csrfProtection = csurf({ignoreMethods: ['GET'], cookie: true});

	app.set('csrfProtection', csrfProtection);

	var models = require("../models.js")(db);

	var LocalFs = require('../helpers/localFs');

	var PersonnelHandler = require("../handlers/personnel");
	var ModuleslHandler = require("../handlers/modules");
	var personnelHandler = new PersonnelHandler(db);
	var modulesHandler = new ModuleslHandler(db);

	var personnelRouter = require('./personnel')(db, app, event);
	var countryRouter = require('./country')(db);
	var branchRouter = require('./branch')(db);
	var contractRouter = require('./contract')(db);
	var itemRouter = require('./item')(db);
	var noteRouter = require('./note')(db);
	var objectiveRouter = require('./objective')(db);
	var shelfRouter = require('./shelf')(db);
	var outletRouter = require('./outlet')(db, event);
	var categoryRouter = require('./category')(db);
	var commentRouter = require('./comment')(db);
	var priorityRouter = require('./priority')(db);
	var mobileRouter = require('./mobile.js')(db);

	var RESPONSES = require('../constants/responses');

	function checkAuth(req, res, next) {
		if (req.session && req.session.loggedIn) {
			next();
		} else {
			res.send(401);
		}
	}

	app.get('/', csrfProtection, function (req, res, next) {
		res.render('index.html', {csrfToken: req.csrfToken()});
	});

	app.post('/upload', multipartMiddleware, function (req, res, next) {
		var localFs = new LocalFs();
		var id = req.session.uId;
		var content = req.headers.contenttype;
		var folderName = path.join(content, id);
		var fileData = req.files.attachfile;

		localFs.postFile(folderName, fileData, function (err) {
			if (err) {
				return next(err);
			}

			res.status(201).send({success: 'file(\'s) uploaded success'});
		});
	});

	app.get('/passwordChange/:forgotToken', csrfProtection, function (req, res, next) {
		var forgotToken = req.params.forgotToken;

		res.render('changePassword.html', {
			host       : process.env.HOST,
			forgotToken: forgotToken,
			csrfToken  : req.csrfToken()
		});
	});

	app.get('/forgotPass', csrfProtection, function (req, res, next) {

		res.render('enterEmail.html', {
			host     : process.env.HOST,
			csrfToken: req.csrfToken()
		});
	});

	app.get('/logout', csrfProtection, function (req, res, next) {
		if (req.session) {
			req.session.destroy(function () {
			});

		}
		res.clearCookie();
		res.redirect('/#login');
	});


	app.get('/modules', checkAuth, modulesHandler.getAll);
	app.post('/login', /*csrfProtection,*/ personnelHandler.login);
	app.get('/authenticated', function (req, res, next) {
		if (req.session && req.session.loggedIn) {
			res.send(200);
		} else {
			res.send(401);
		}
	});

	app.use('/personnel', personnelRouter);
	app.use('/country', countryRouter);
	app.use('/branch', branchRouter);
	app.use('/contract', contractRouter);
	app.use('/item', itemRouter);
	app.use('/note', noteRouter);
	app.use('/objective', objectiveRouter);
	app.use('/shelf', shelfRouter);
	app.use('/outlet', outletRouter);
	app.use('/category', categoryRouter);
	app.use('/comment', commentRouter);
	app.use('/priority', priorityRouter);
	app.use('/mobile', mobileRouter);

	function notFound(req, res, next) {
		res.status(404);


		if (req.accepts('html')) {
			return res.send(RESPONSES.PAGE_NOT_FOUND);
		}

		if (req.accepts('json')) {
			return res.json({error: RESPONSES.PAGE_NOT_FOUND});
		}

		res.type('txt');
		res.send(RESPONSES.PAGE_NOT_FOUND);

	};

	function errorHandler(err, req, res, next) {
		var status = err.status || 500;

		if (process.env.NODE_ENV === 'production') {
			if (status === 401) {
				logWriter.log('', err.message + '\n' + err.stack);
			}
			res.status(status).send({error: err.message});
		} else {
			if (status !== 401) {
				logWriter.log('', err.message + '\n' + err.stack);
			}
			res.status(status).send({error: err.message + '\n' + err.stack});
		}
	};

	function csrfErrorParser(err, req, res, next) {
		if (err.code !== 'EBADCSRFTOKEN') {
			return next(err);
		}
		// handle CSRF token errors here
		res.status(403);

		if (req.accepts('html')) {
			return res.send('form tampered with');
		}

		if (req.accepts('json')) {
			return res.json({error: 'form tampered with'});
		}

		res.type('txt');
		res.send('form tampered with');
	};

	/*event.on('createdChild', function (id, targetModel, searchField, fieldName, fieldValue, fieldInArray) {
	 var searchObject = {};
	 var updateObject = {};

	 searchObject[searchField] = id;

	 if (fieldInArray) {
	 updateObject['$addToSet'] = {};
	 updateObject['$addToSet'][fieldName] = fieldValue;
	 } else {
	 updateObject[fieldName] = fieldValue;
	 }

	 targetModel.update(searchObject, updateObject, {multi: true}, function (err) {
	 if (err) {
	 logWriter.log('eventEmiter_createdChild', err.message);
	 }
	 });
	 });*/

	app.use(notFound);
	app.use(csrfErrorParser);
	app.use(errorHandler);
};