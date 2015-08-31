require('../config/development');

var request = require('supertest');
var expect = require('chai').expect;

var host = process.env.HOST;
var url;
var agent;

var adminObject = {
    email: 'admin@admin.com',
    pass: '121212'
};

describe("BDD for module", function () {
    before("Login: (should return logged personnel)", function (done) {
        agent = request.agent(host);

        agent
            .post('/login')
            .send(adminObject)
            .expect(200, function (err, resp) {
                if (err) {
                    return done(err);
                }

                expect(resp).to.be.instanceOf(Object);
                done();
            });
    });

    it("Get modules list", function (done) {
        agent
            .get('/modules')
            .expect(200, function(err, resp) {
                if (err) {
                    return done(err);
                }

                expect(resp.body).to.be.instanceOf(Array);
                expect(resp.body.length).to.be.above(0);
                done();
            });
    });
});
