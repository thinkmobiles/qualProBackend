require('../config/development');

var moduleCreator = require('../modulesCreators/addModules');

var expect = require('chai').expect;

describe("BDD for modules creator for qualPro", function () {

    it("Creating modules:", function (done) {
        moduleCreator.create(function(err, resp){
            if(err){
                return done(err);
            }

            expect(resp).to.be.instanceOf(Object);
        });
    });
});
