var express = require('express');
var router = express.Router();
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

module.exports = function (db) {
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

    for (var route in routes) {
        router.use('/' + route, routes[route])
    }
    return router;
};