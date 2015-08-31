/**
 * Created by micha on 8/31/2015.
 */
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

var countryTestManager;

var country = {
    name: 'Laplandy',
    description: 'Home of Santa Claus',
    manager: null
};

var newCountryName = 'Ireland';
var newCountryDescription = 'Land of ginger people';
var createdId;

describe("BDD for country", function () {  // Runs once before all tests start.
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

    it("Create new country should return country", function (done) {
        agent
            .post('/country')
            .send(country)
            .expect(200, function (err, resp) {
                if (err) {
                    return done(err);
                }

                createdId = resp.body._id;
                done();

            });
    });

    it("Get country by id should return country", function (done) {
        agent
            .get('/country/' + createdId)
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

    it("Update: country should change its description and name", function (done) {
        agent
            .put('/country/' + createdId)
            .send({name: newCountryName, description: newCountryDescription})
            .expect(200, function (err, res) {
                if (err) {
                    return done(err)
                }
                expect(res.body).to.be.instanceOf(Object);
                done();
            });
    });

    it("Get country one more time and check if update was successfull", function (done) {
        agent
            .get('/country/' + createdId)
            .expect(200, function (err, res) {
                var body = res.body;
                if (err) {
                    return done(err)
                }
                expect(body).to.be.instanceOf(Object);
                expect(body.name).to.be.equal(newCountryName);
                expect(body.description).to.be.equal(newCountryDescription);
                done();
            });
    });


    it("Get all countries", function (done) {
        agent
            .get('/country')
            .expect(200, function (err, res) {
                if (err) {
                    return done(err)
                }
                expect(res.body).to.be.instanceOf(Array);
                done();
            });
    });

    it("Delete country:", function (done) {
        agent
            .delete('/country/' + createdId)
            .expect(200, done);
    });

    it("Try get deleted country and recieve empty object", function (done) {
        agent
            .get('/country/' + createdId)
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