/*
require('../config/development');

var request = require('supertest');
var expect = require('chai').expect;

var host = process.env.HOST;
var baseUrl = '/shelf';
var agent;
var singular = 'shelf';
var plural = 'shelves';


var adminObject = {
    email: 'admin@admin.com',
    pass: '121212'
};

//todo change objects

var testObject = {
    name: 'test',
    packageSize: "test",
    description: 'test',
    sku: 'test'
};

var objectUpdate = {
    name: 'NotTest',
    packageSize: "NotTest",
    description: 'NotTest',
    sku: 'NotTest'
};
var testObj=require('./helpers/cache');
var createdId;

describe("BDD for " + singular, function () {  // Runs once before all tests start.
    before("Get agent", function (done) {
        agent = testObj.agent;
        done();
    });

    it("Create new " + singular + " should return " + singular, function (done) {
        agent
            .post(baseUrl)
            .send(testObject)
            .expect(201, function (err, resp) {
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
            .patch(baseUrl + '/' + createdId)
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

    //it("Try get archived " + singular + " and check archived property object", function (done) {
    //    agent
    //        .get(baseUrl + '/' + createdId)
    //        .expect(200, function (err, res) {
    //            var body = res.body;
    //
    //            if (err) {
    //                return done(err)
    //            }
    //            expect(body).to.be.instanceOf(Object);
    //            expect(body.isArchived);
    //            done();
    //        });
    //});
});

*/
