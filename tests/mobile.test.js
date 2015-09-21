/*
require('../config/development');

var request = require('supertest');
var expect = require('chai').expect;

var host = process.env.HOST;
var baseUrl = '/branch';
var agent;
var singular = 'branch';
var plural = 'branches';

var adminObject = {
    _csrf: '',
    email: 'admin@admin.com',
    pass : '121212'
};

var testObject = {
    name: 'test'
};

var objectUpdate = {
    name: 'NotTest'
};

var createdId;

describe.only("BDD for mobile", function () {  // Runs once before all tests start.
    before("Get agent", function (done) {
        agent = request.agent(host);
        done();
    });

    it('try to login', function (done) {
        agent
            .post('/mobile/login')
            .send(adminObject)
            .expect(200, function (err, resp) {
                var body;
                if (err) {
                    return done(err);
                }

                body = resp.body;
                expect(body).to.be.instanceOf(Object);
                done();

            });
    });
});

*/
