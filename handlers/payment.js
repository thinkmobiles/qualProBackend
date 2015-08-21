/**
 * Created by Roman on 04.05.2015.
 */

/**
 * Created by Roman on 04.05.2015.
 */

var mongoose = require('mongoose');
var async = require('async');
var WorkflowHandler = require('./workflow');
var _ = require('lodash');

var CONSTANTS = require('../constants/modules');

function returnModuleId(req){
    var body = req.body;
    var moduleId;

    var isWtrack = req.session.lastDb === 'weTrack';

    if(isWtrack){
        moduleId = 61;
    } else {
        moduleId = !!body.forSales ? 61 : 60
    }

    return moduleId;
}

var Payment = function (models) {
    var access = require("../Modules/additions/access.js")(models);

    var EmployeeSchema = mongoose.Schemas['Employee'];
    var PaymentSchema = mongoose.Schemas['Payment'];
    var wTrackPaymentSchema = mongoose.Schemas['wTrackPayment'];
    var InvoiceSchema = mongoose.Schemas['Invoice'];
    var DepartmentSchema = mongoose.Schemas['Department'];
    var wTrackSchema = mongoose.Schemas['wTrack'];

    var objectId = mongoose.Types.ObjectId;
    var waterfallTasks;

    this.getAll = function (req, res, next) {
        //this temporary unused
        var isWtrack = req.session.lastDb === 'weTrack';
        var Payment;

        if(isWtrack){
            Payment = models.get(req.session.lastDb, 'wTrackPayment', wTrackPaymentSchema);
        } else {
            Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        }

        var query = {};

        Payment.find(query, function (err, payments) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: payments});
        });
    };

    this.getForView = function (req, res, next) {
        var viewType = req.params.viewType;
        var forSale = req.params.byType === 'customers';

        switch (viewType) {
            case "list":
                getPaymentFilter(req, res, next, forSale);
                break;
        }
    };

    function getPaymentFilter(req, res, next, forSale) {
        var isWtrack = req.session.lastDb === 'weTrack';
        var Payment;

        var moduleId = returnModuleId(req);

        if(isWtrack){
            Payment = models.get(req.session.lastDb, 'wTrackPayment', wTrackPaymentSchema);
        } else {
            Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        }

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {
                    var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

                    var optionsObject = {forSale: forSale};
                    var sort = {};
                    var count = req.query.count ? req.query.count : 100;
                    var page = req.query.page;
                    var skip = (page - 1) > 0 ? (page - 1) * count : 0;

                    var departmentSearcher;
                    var contentIdsSearcher;
                    var contentSearcher;
                    var waterfallTasks;

                    if (req.query.sort) {
                        sort = req.query.sort;
                    } else {
                        sort = {"date": -1};
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

                        Payment.aggregate(
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

                    contentSearcher = function (paymentsIds, waterfallCallback) {
                        optionsObject._id = {$in: paymentsIds};
                        var query = Payment.find(optionsObject).limit(count).skip(skip).sort(sort);

                        query
                            .populate('invoice._id', '_id name');
                            /*.populate('paymentMethod', '_id name');*/

                        query.exec(function(err, result){
                            if(err){
                                return waterfallCallback(err);
                            }

                            Employee.populate(result, {path: 'invoice.salesPerson', select: '_id name', options: {lean: true}}, function(){
                                waterfallCallback(null, result);
                            });
                        });
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

    this.create = function (req, res, next) {
        var body = req.body;
        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        var workflowHandler = new WorkflowHandler(models);
        var invoiceId = body.invoice;

        var moduleId = returnModuleId(req);

        var isWtrack = req.session.lastDb === 'weTrack';
        var Payment;

        if(isWtrack){
            Payment = models.get(req.session.lastDb, 'wTrackPayment', wTrackPaymentSchema);
        } else {
            Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        }

        function fetchInvoice(waterfallCallback) {
            Invoice.findById(invoiceId, waterfallCallback);
        };

        function savePayment(invoice, waterfallCallback) {
            var payment = new Payment(body);

            //payment.paidAmount = invoice.paymentInfo ? invoice.paymentInfo.total : 0;
            payment.name = invoice.sourceDocument;
            payment.whoCanRW = invoice.whoCanRW;
            payment.groups = invoice.groups;
            payment.createdBy.user = req.session.uId;
            payment.editedBy.user = req.session.uId;

            payment.save(function (err, payment) {
                if (err) {
                    return waterfallCallback(err);
                }
                waterfallCallback(null, invoice, payment);
            });
        };

        function invoiceUpdater(invoice, payment, waterfallCallback) {
            var totalToPay = (invoice.paymentInfo) ? invoice.paymentInfo.balance : 0;
            var paid = payment.paidAmount;
            var isNotFullPaid;
            var request = {
                query: {
                    wId: 'Purchase Invoice',
                    source: 'purchase',
                    targetSource: 'invoice'
                },
                session: req.session
            };

            totalToPay = parseFloat(totalToPay);
            paid = parseFloat(paid);

            isNotFullPaid = paid < totalToPay;

            if (isNotFullPaid) {
                request.query.status = 'In Progress';
                request.query.order = 1;
            } else {
                request.query.status = 'Done';
                request.query.order = 1;
            }

            workflowHandler.getFirstForConvert(request, function (err, workflow) {
                if (err) {
                    return waterfallCallback(err);
                }

                invoice.workflow = workflow._id;
                invoice.paymentInfo.balance = (totalToPay - paid);
                invoice.paymentInfo.unTaxed += paid / 100;
                invoice.payments.push(payment._id);
                invoice.save(function (err, invoice) {
                    if (err) {
                        return waterfallCallback(err);
                    }

                    waterfallCallback(null, invoice, payment);
                });
            });
        };


        function updateWtrack(invoice, payment, waterfallCallback) {
            var paid = payment.paidAmount || 0;
            var wTrackIds = _.pluck(invoice.products, 'product');

            function updateWtrack(id, cb) {
                var wTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

                function wTrackFinder(innerWaterfallCb) {
                    wTrack.findById(id, function (err, wTrackDoc) {
                        if (err) {
                            return innerWaterfallCb(err);
                        }
                        innerWaterfallCb(null, wTrackDoc);
                    });
                };

                function wTrackUpdater(wTrackDoc, innerWaterfallCb) {
                    var wTrackAmount;
                    var revenue;
                    var differance;
                    var isPaid;
                    var amount;
                    var err;

                    if(!wTrackDoc){
                        err = new Error('wTracks are missing');

                        return innerWaterfallCb(err);
                    }

                    if (!wTrackDoc.isPaid) {
                        revenue = wTrackDoc.revenue;
                        wTrackAmount = wTrackDoc.amount;
                        differance = wTrackAmount - revenue; //differance - negative value

                        if ((paid + differance) >= 0) {
                            differance = -differance;
                        } else {
                            differance = paid;
                        }

                        paid -= differance;
                        wTrackAmount += differance;
                        isPaid = revenue === wTrackAmount;

                        wTrackDoc.amount = wTrackAmount / 100;
                        wTrackDoc.isPaid = isPaid;
                        wTrackDoc.save(function (err, saved) {
                            if (err) {
                                return innerWaterfallCb(err);
                            }
                            innerWaterfallCb(null, payment);
                        });
                    } else {
                        innerWaterfallCb(null, payment);
                    }
                };

                async.waterfall([wTrackFinder, wTrackUpdater], cb);
            };

            if (!paid) {
                return waterfallCallback(null, payment);
            }

            async.eachSeries(wTrackIds, updateWtrack, function (err, result) {
                if (err) {
                    return waterfallCallback(err);
                }

                waterfallCallback(null, payment);
            });


        };

        waterfallTasks = [fetchInvoice, savePayment, invoiceUpdater];

        if (req.session.lastDb === 'weTrack') {
            waterfallTasks.push(updateWtrack);
        }

        access.getEditWritAccess(req, req.session.uId, moduleId, function (access) {
            if (access) {
                async.waterfall(waterfallTasks, function (err, response) {
                    if (err) {
                        return next(err);
                    }

                    res.status(201).send(response);
                });
            } else {
                res.status(403).send();
            }
        });
    };

    this.totalCollectionLength = function (req, res, next) {
        var forSale = req.params.byType === 'customers';

        var queryObject = {};

        var departmentSearcher;
        var contentIdsSearcher;

        var contentSearcher;
        var waterfallTasks;

        var isWtrack = req.session.lastDb === 'weTrack';
        var Payment;

        if(isWtrack){
            Payment = models.get(req.session.lastDb, 'wTrackPayment', wTrackPaymentSchema);
        } else {
            Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        }

        queryObject = {
            forSale: forSale
        };

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

            models.get(req.session.lastDb, "Payment", PaymentSchema).aggregate(
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

        contentSearcher = function (paymentIds, waterfallCallback) {
            var query;
            var queryObject = {_id: {$in: paymentIds}};

            query = Payment.find(queryObject);
            query.count(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({count: result});
        });
    };

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var uId;
        var Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);

        var moduleId = returnModuleId(req);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {
                    async.each(body, function (data, cb) {
                        var id = data._id;

                        data.editedBy = {
                            user: uId,
                            date: new Date().toISOString()
                        };

                        delete data._id;
                        Payment.findByIdAndUpdate(id, {$set: data}, cb);
                    }, function (err) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send({success: 'updated'});
                    });
                } else {
                    res.status(403).send();
                }
            });
        } else {
            res.status(401).send();
        }
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var isWtrack = req.session.lastDb === 'weTrack';
        var Payment;

        var moduleId = req.headers.mId || returnModuleId(req);

        if(isWtrack){
            Payment = models.get(req.session.lastDb, 'wTrackPayment', wTrackPaymentSchema);
        } else {
            Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        }

        access.getDeleteAccess(req, req.session.uId, moduleId, function (access) {
            if (access) {
                Payment.remove({_id: id}, function (err, removed) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send({success: removed});
                });
            } else {
                res.send(403);
            }
        });


    };

};

module.exports = Payment;