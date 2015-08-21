/**
 * Created by ANDREY on 29.04.2015.
 */

var mongoose = require('mongoose');
var WorkflowHandler = require('./workflow');
var RESPONSES = require('../constants/responses');

var Invoice = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var InvoiceSchema = mongoose.Schemas['Invoice'];
    var wTrackInvoiceSchema = mongoose.Schemas['wTrackInvoice'];
    var OrderSchema = mongoose.Schemas['Quotation'];
    var DepartmentSchema = mongoose.Schemas['Department'];
    var CustomerSchema = mongoose.Schemas['Customer'];
    var PaymentSchema = mongoose.Schemas['Payment'];
    var wTrackSchema = mongoose.Schemas['wTrack'];
    var objectId = mongoose.Types.ObjectId;
    var async = require('async');
    var workflowHandler = new WorkflowHandler(models);
    var moment = require('../public/js/libs/moment/moment');
    var _ = require('../node_modules/underscore');

    this.create = function (req, res, next) {
        var isWtrack = req.session.lastDb === 'weTrack';
        var body = req.body;
        var Invoice;
        var invoice;

        if(isWtrack){
            Invoice = models.get(req.session.lastDb, 'wTrackInvoice', wTrackInvoiceSchema);
        } else {
            Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        }

        invoice = new Invoice(body);

        if (req.session.uId) {
            invoice.createdBy.user = req.session.uId;
            invoice.editedBy.user = req.session.uId;
        }

        invoice.save(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.receive = function (req, res, next) {
        var id = req.body.orderId;
        var forSales = !!req.body.forSales;
        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        var Order = models.get(req.session.lastDb, 'Quotation', OrderSchema);
        var parallelTasks;
        var waterFallTasks;

        function fetchFirstWorkflow(callback) {
            var request = {
                query: {
                    wId: 'Purchase Invoice',
                    source: 'purchase',
                    targetSource: 'invoice'
                },
                session: req.session
            };

            workflowHandler.getFirstForConvert(request, callback);
        }

        function findOrder(callback) {
            Order.findById(id).lean().exec(callback);
        };

        function parallel(callback) {
            async.parallel(parallelTasks, callback);
        };

        function createInvoice(parallelResponse, callback) {
            var order;
            var workflow;
            var err;
            var invoice;

            if (parallelResponse && parallelResponse.length) {
                order = parallelResponse[0];
                workflow = parallelResponse[1];
            } else {
                err = new Error(RESPONSES.BAD_REQUEST);
                err.status = 400;

                return callback(err);
            }

            delete order._id;
            invoice = new Invoice(order);

            if (req.session.uId) {
                invoice.createdBy.user = req.session.uId;
                invoice.editedBy.user = req.session.uId;
            }

            invoice.sourceDocument = order.name;
            invoice.paymentReference = order.name;
            invoice.workflow = workflow._id;
            invoice.paymentInfo.balance = order.paymentInfo.total;

            invoice.save(callback);

        };

        parallelTasks = [findOrder, fetchFirstWorkflow];
        waterFallTasks = [parallel, createInvoice];

        async.waterfall(waterFallTasks, function (err, result) {
            if (err) {
                return next(err)
            }

            res.status(201).send(result);
        });

    };

    this.updateOnlySelected = function (req, res, next) {
        var id = req.params.id;
        var data = req.body;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 56, function (access) {
                if (access) {

                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    };

                    var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);

                    Invoice.findByIdAndUpdate(id, {$set: data}, function (err, invoice) {
                        if (err) {
                            next(err);
                        } else {
                            res.status(200).send(invoice);
                        }
                    });

                } else {
                    res.status(403).send();
                }
            });
        } else {
            res.status(401).send();
        }
    };

    this.getAll = function (req, res, next) {
        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        var query = {};

        Invoice.find(query, function (err, invoices) {
            if (err) {
                return next(err);
            }
            res.status(200).send(invoices);
        });
    };

    this.getForView = function (req, res, next) {
        var db = req.session.lastDb;
        var moduleId = 56;

        if (db === 'weTrack'){
            moduleId = 64
        }

        if (req.session && req.session.loggedIn && db) {
            access.getReadAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {
                    var Invoice = models.get(db, 'Invoice', InvoiceSchema);

                    var query = req.query;
                    var queryObject = {};

                    var optionsObject = {};
                    var sort = {};
                    var count = query.count ? query.count : 100;
                    var page = query.page;
                    var skip = (page - 1) > 0 ? (page - 1) * count : 0;

                    var departmentSearcher;
                    var contentIdsSearcher;
                    var contentSearcher;
                    var waterfallTasks;

                    if (query && query.filter && query.filter.forSales === 'true') {
                        queryObject['forSales'] = true;
                    } else {
                        queryObject['forSales'] = false;
                    }

                    if (req.query.sort) {
                        sort = req.query.sort;
                        //} else {
                        //    sort = {"supplier": 1};
                    }

                    departmentSearcher = function (waterfallCallback) {
                        models.get(req.session.lastDb, "Department", DepartmentSchema).aggregate(
                            {
                                $match: {
                                    users: objectId(req.session.uId)
                                }
                            }, {
                                $project: {
                                    _id: 1
                                }
                            },
                            waterfallCallback);
                    };

                    contentIdsSearcher = function (deps, waterfallCallback) {
                        var arrOfObjectId = deps.objectID();

                        models.get(req.session.lastDb, "Invoice", InvoiceSchema).aggregate(
                            {
                                $match: {
                                    $and: [
                                        queryObject,
                                        {
                                            $or: [
                                                {
                                                    $or: [
                                                        {
                                                            $and: [
                                                                {whoCanRW: 'group'},
                                                                {'groups.users': objectId(req.session.uId)}
                                                            ]
                                                        },
                                                        {
                                                            $and: [
                                                                {whoCanRW: 'group'},
                                                                {'groups.group': {$in: arrOfObjectId}}
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    $and: [
                                                        {whoCanRW: 'owner'},
                                                        {'groups.owner': objectId(req.session.uId)}
                                                    ]
                                                },
                                                {whoCanRW: "everyOne"}
                                            ]
                                        }
                                    ]
                                }
                            },
                            {
                                $project: {
                                    _id: 1
                                }
                            },
                            waterfallCallback
                        );
                    };

                    contentSearcher = function (invoicesIds, waterfallCallback) {
                        optionsObject.$and = [];
                        optionsObject.$and.push({_id: {$in: invoicesIds}});

                        if (req.query && req.query.filter) {
                            if (req.query.filter.condition === 'or') {
                                optionsObject.$or = [];
                            }
                            /*if (req.query.filter.workflow) {
                                optionsObject.$and.push({workflow: {$in: req.query.filter.workflow}});
                            }*/
                            if (req.query.filter['Due date']) {
                                if (req.query.filter.condition === 'or') {
                                    optionsObject.$or.push({dueDate: {$gte: new Date(req.query.filter['Due date'][0].start), $lte: new Date(req.query.filter['Due date'][0].end)}});
                                } else {
                                    optionsObject.$and.push({dueDate: {$gte: new Date(req.query.filter['Due date'][0].start), $lte: new Date(req.query.filter['Due date'][0].end)}});
                                }

                            }
                            if (req.query.filter.salesPerson) {
                                if (req.query.filter.condition === 'or') {
                                    optionsObject.$or.push({salesPerson: {$in: req.query.filter.salesPerson}})
                                } else {
                                    optionsObject.$and.push({salesPerson: {$in: req.query.filter.salesPerson}})
                                }
                            }
                        }

                        var query = Invoice.find(optionsObject).limit(count).skip(skip).sort(sort);

                        query.populate('supplier', 'name _id').
                            populate('salesPerson', 'name _id').
                            populate('department', '_id departmentName').
                            populate('createdBy.user').
                            populate('editedBy.user').
                            populate('groups.users').
                            populate('groups.group').
                            populate('groups.owner', '_id login').
                            populate('project', '_id projectName').
                            populate('workflow', '-sequence');

                        query.lean().exec(waterfallCallback);
                    };

                    waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

                    async.waterfall(waterfallTasks, function (err, result) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send(result);
                    });
                } else {
                    res.status(403).send();
                }
            });

        } else {
            res.status(401).send();
        }
    };

    this.getInvoiceById = function (req, res, next) {
        var isWtrack = req.session.lastDb === 'weTrack';
        var moduleId = 56;

        if (isWtrack){
            moduleId = 64
        }

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {
                    var Invoice;
                    var optionsObject = {};

                    var departmentSearcher;
                    var contentIdsSearcher;
                    var contentSearcher;
                    var waterfallTasks;

                    if(isWtrack){
                        Invoice = models.get(req.session.lastDb, 'wTrackInvoice', wTrackInvoiceSchema);
                    } else {
                        Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
                    }

                    departmentSearcher = function (waterfallCallback) {
                        models.get(req.session.lastDb, "Department", DepartmentSchema).aggregate(
                            {
                                $match: {
                                    users: objectId(req.session.uId)
                                }
                            }, {
                                $project: {
                                    _id: 1
                                }
                            },

                            waterfallCallback);
                    };

                    contentIdsSearcher = function (deps, waterfallCallback) {
                        var arrOfObjectId = deps.objectID();

                        models.get(req.session.lastDb, "Invoice", InvoiceSchema).aggregate(
                            {
                                $match: {
                                    $and: [
                                        /*optionsObject,*/
                                        {
                                            $or: [
                                                {
                                                    $or: [
                                                        {
                                                            $and: [
                                                                {whoCanRW: 'group'},
                                                                {'groups.users': objectId(req.session.uId)}
                                                            ]
                                                        },
                                                        {
                                                            $and: [
                                                                {whoCanRW: 'group'},
                                                                {'groups.group': {$in: arrOfObjectId}}
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    $and: [
                                                        {whoCanRW: 'owner'},
                                                        {'groups.owner': objectId(req.session.uId)}
                                                    ]
                                                },
                                                {whoCanRW: "everyOne"}
                                            ]
                                        }
                                    ]
                                }
                            },
                            {
                                $project: {
                                    _id: 1
                                }
                            },
                            waterfallCallback
                        );
                    };

                    contentSearcher = function (invoicesIds, waterfallCallback) {
                        var data = {};
                        for (var i in req.query) {
                            data[i] = req.query[i];
                        }
                        var id = data.id;
                        optionsObject = {_id: id};

                        var query = Invoice.findOne(optionsObject);

                        query.populate('supplier', '_id name').
                            populate('salesPerson', 'name _id').
                            populate('project', '_id projectName').
                            populate('products.product').
                            populate('payments', '_id name date paymentRef paidAmount').
                            populate('department', '_id departmentName').
                            populate('paymentTerms', '_id name').
                            populate('createdBy.user').
                            populate('editedBy.user').
                            populate('groups.users').
                            populate('groups.group').
                            populate('groups.owner', '_id login').
                            populate('workflow', '-sequence');

                        query.lean().exec(waterfallCallback);
                    };

                    waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

                    async.waterfall(waterfallTasks, function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send(result);
                    });
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    this.removeInvoice = function (req, res, id, next) {
        var db = req.session.lastDb;
        var moduleId = 56;
        var paymentIds = [];
        var wTrackIds  = [];
        var invoiceDeleted;
        var Payment = models.get(db, "Payment", PaymentSchema);
        var wTrack = models.get(db, "wTrack", wTrackSchema);

        if (db === 'weTrack'){
            moduleId = 64
        }

        if (req.session && req.session.loggedIn && db) {
            access.getDeleteAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {

                    models.get(db, "Invoice", InvoiceSchema).findByIdAndRemove(id, function (err, result) {
                        if (err) {
                           return next(err);
                        }

                        invoiceDeleted = result.toJSON();

                        async.each(invoiceDeleted.products, function (product) {
                            wTrackIds.push(product.product);
                        });
                        async.each(invoiceDeleted.payments, function (payment) {
                            paymentIds.push(payment);
                        });

                        function paymentsRemove (){
                            async.each(paymentIds, function (id) {
                                Payment.findByIdAndRemove(id, function (err, result) {
                                    if (err) {
                                        return console.log(err);
                                    }
                                    console.log('success');
                                });
                            });
                        };

                        function wTrackUpdate (){
                            var setData = {};

                            async.each(wTrackIds, function (id) {
                                setData.editedBy = {
                                    user: req.session.uId,
                                    date: new Date().toISOString()
                                };

                                setData.isPaid = false;
                                setData.amount = 0;

                                wTrack.findByIdAndUpdate(id, setData, function (err, result) {
                                    if (err) {
                                        return console.log(err);
                                    }
                                    console.log('success');
                                });
                            });
                        };

                        async.parallel([paymentsRemove, wTrackUpdate], function (err, result) {
                            if (err){
                                next(err)
                            }

                            console.log('success');

                        });

                        res.status(200).send(result);
                    });

                } else {
                    res.status(403).send();
                }
            });

        } else {
            res.status(401).send();
        }

    };

    this.updateInvoice = function (req, res, _id, data, next) {
        var db = req.session.lastDb;
        var moduleId = 56;

        if (db === 'weTrack'){
            moduleId = 64
        }

        if (req.session && req.session.loggedIn && db) {
            access.getEditWritAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {
                    var Invoice = models.get(db, 'Invoice', InvoiceSchema);
                    //data.editedBy = {
                    //    user: req.session.uId,
                    //    date: new Date().toISOString()
                    //}

                    //if (data.supplier && data.supplier._id) {
                    //    data.supplier = data.supplier._id;
                    //}

                    Invoice.findByIdAndUpdate(_id, data.invoice, function (err, result) {

                        if (err) {
                            next(err);
                        } else {
                            res.status(200).send(result);
                        }
                    })

                } else {
                    res.status(403).send();
                }
            });

        } else {
            res.status(401).send();
        }

    };

    this.totalCollectionLength = function (req, res, next) {
        var data = req.query;

        var optionsObject = {};
        var result = {};

        result['showMore'] = false;

        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);

        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var waterfallTasks;

        if (data && data.filter && data.filter.forSales) {
            optionsObject['forSales'] = true;
        } else {
            optionsObject['forSales'] = false;
        }

        departmentSearcher = function (waterfallCallback) {
            models.get(req.session.lastDb, "Invoice", InvoiceSchema).aggregate(
                {
                    $match: {
                        users: objectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },

                waterfallCallback);
        };

        contentIdsSearcher = function (deps, waterfallCallback) {
            var arrOfObjectId = deps.objectID();

            models.get(req.session.lastDb, "Invoice", InvoiceSchema).aggregate(
                {
                    $match: {
                        $and: [
                            optionsObject,
                            {
                                $or: [
                                    {
                                        $or: [
                                            {
                                                $and: [
                                                    {whoCanRW: 'group'},
                                                    {'groups.users': objectId(req.session.uId)}
                                                ]
                                            },
                                            {
                                                $and: [
                                                    {whoCanRW: 'group'},
                                                    {'groups.group': {$in: arrOfObjectId}}
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        $and: [
                                            {whoCanRW: 'owner'},
                                            {'groups.owner': objectId(req.session.uId)}
                                        ]
                                    },
                                    {whoCanRW: "everyOne"}
                                ]
                            }
                        ]
                    }
                },
                {
                    $project: {
                        _id: 1
                    }
                },
                waterfallCallback
            );
        };

        contentSearcher = function (invoicesIds, waterfallCallback) {
            var query;

            optionsObject.$and = [];
            optionsObject.$and.push({_id: {$in: invoicesIds}});

            if (req.query && req.query.filter) {
                if (req.query.filter.workflow) {
                    optionsObject.$and.push({workflow: {$in: req.query.filter.workflow}});
                }
                if (req.query.filter['Due date']) {
                    optionsObject.$and.push({dueDate: {$gte: new Date(req.query.filter['Due date'][0].start), $lte: new Date(req.query.filter['Due date'][0].end)}});

                }
                if (req.query.filter.salesPerson) {
                    optionsObject.$and.push({salesPerson: {$in: req.query.filter.salesPerson}})
                }
            }

            query = Invoice.find(optionsObject);
            query.exec(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, invoice) {
            if (err) {
                return next(err);
            } else {

                result['count'] = invoice.length;
                res.status(200).send(result);
            }
        });
    };

    this.generateName = function (req, res, next) {
        var project = req.query.projectId;
        var currentDbName = req.session ? req.session.lastDb : null;
        var db = currentDbName ? models.connection(currentDbName) : null;
        var date = moment().format('DD/MM/YYYY');

        db.collection('settings').findAndModify({
                dbName: currentDbName,
                name: 'invoice',
                project: project
            },
            [['name', 1]],
            {
                $inc: {seq: 1}
            },
            {
                new: true,
                upsert: true
            },
            function (err, rate) {
                var resultName;

                if (err) {
                    return next(err);
                }

                resultName = rate.seq + '-' + date;
                res.status(200).send(resultName) ;
            });
    };

    this.getFilterValues = function (req, res, next) {
        var EmployeeSchema = mongoose.Schemas['Employee'];
        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);


        async.waterfall([
            function (cb) {
                Invoice
                    .aggregate([
                        {
                            $group:{
                                _id: null,
                                'Due date': {
                                    $addToSet: '$dueDate'
                                }/*,
                                'salesPerson': {
                                    $addToSet: '$salesPerson'
                                }*/
                            }
                        }
                    ], function (err, invoice) {
                        if (err) {
                            cb(err)

                        } else {
                            cb(null, invoice)
                        }

                    })
            }/*,
            function (invoice, cb) {
                Employee
                    .populate(invoice , {
                        path: 'salesPerson',
                        model: Employee,
                        select: 'name _id'
                    },
                    function (err, invoice) {
                        if (err) {
                            return cb(err)

                        }
                            cb(null, invoice)

                })
            }*/

        ], function (err, result) {
            if (err) {
               return next(err)
            }

            _.map(result[0], function(value, key) {
                switch (key) {
                    case 'salesPerson':
                        result[0][key] = _.sortBy(value, 'name');
                        break;;

                }
            });
            res.status(200).send(result)
        })
    };

};

module.exports = Invoice;