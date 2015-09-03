require('../config/development');
var CONSTANTS=require('../constants/mainConstants');
var request = require('supertest');
var expect = require('chai').expect;

var host = process.env.HOST;
var baseUrl = '/note';
var agent;
var singular = CONSTANTS.NOTE;
var plural = 'notes';


var adminObject = {
    email: 'admin@admin.com',
    pass: '121212'
};

var testObject = {
    description: 'test',
};

var objectUpdate = {
    description: 'NotTest',
};

var createdId;

describe("BDD for " + singular, function () {  // Runs once before all tests start.
    before("Login: (should return logged personnel)", function (done) {
        agent = request.agent(host);

        agent
            .post('/login')
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

    it("Create new " + singular + " should return " + singular, function (done) {
        agent
            .post(baseUrl)
            .send(testObject)
            .expect(200, function (err, resp) {
                if (err) {
                    return done(err);
                }

                createdId = resp.body._id;
                done();

            });
    });

    it("Get " + singular + " by id should return " + singular, function (done) {
        agent
            .get(baseUrl + '/' + createdId)
            .expect(200, function (err, res) {
                var body;

                if (err) {
                    return done(err)
                }

                body = res.body;
                expect(body).to.be.instanceOf(Object);
                expect(body._id).to.be.equal(createdId);
                done();
            });
    });

    it("Update " + singular + " should return 200", function (done) {
        agent
            .put(baseUrl + '/' + createdId)
            .send(objectUpdate)
            .expect(200, function (err, res) {
                if (err) {
                    return done(err)
                }
                expect(res.body).to.be.instanceOf(Object);
                done();
            });
    });

    it("Get " + singular + " one more time and check if update was successfull", function (done) {
        agent
            .get(baseUrl + '/' + createdId)
            .expect(200, function (err, res) {
                var body = res.body;
                if (err) {
                    return done(err)
                }
                expect(body).to.be.instanceOf(Object);
                var keys = Object.keys(objectUpdate);
                keys.forEach(function (key) {
                    expect(body[key]).to.be.equal(objectUpdate[key]);
                });
                done();
            });
    });


    it("Get all " + plural, function (done) {
        agent
            .get(baseUrl)
            .expect(200, function (err, res) {
                if (err) {
                    return done(err)
                }
                expect(res.body).to.be.instanceOf(Array);
                done();
            });
    });

    it("Delete " + singular, function (done) {
        agent
            .delete(baseUrl + '/' + createdId)
            .expect(200, done);
    });

    it("Try get deleted " + singular + " and recieve empty object", function (done) {
        agent
            .get(baseUrl + '/' + createdId)
            .expect(200, function (err, res) {
                var body = res.body;

                if (err) {
                    return done(err)
                }
                expect(body).to.be.instanceOf(Object);
                expect(Object.keys(body).length).to.be.equal(0);
                done();
            });
    });
});

