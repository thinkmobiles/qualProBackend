require('../config/development');
var CONSTANTS = require('../constants/mainConstants');
var request = require('supertest');
var expect = require('chai').expect;

var host = process.env.HOST;

var agent;

var adminObject = {
    email: 'admin@admin.com',
    pass: '121212'
};

var testCountry1 = {name: 'Ukraine'};
var testCountry2 = {name: 'Hungary'};
var testOutlet1 = {name: 'Vopak'};
var testOutlet2 = {name: 'Dastor'};
var testOutlet3 = {name: 'Spar'};
var testBranch1 = {name: 'V-Uzh-A'};
var testBranch2 = {name: 'V-Lviv-B'};
var testBranch3 = {name: 'D-Uzh'};
var testBranch4 = {name: 'S-Budapest'};
var cache=require('./helpers/cache');
var country1Id;
var country2Id;

var outlet1Id;
var outlet2Id;
var outlet3Id;

var branch1Id;
var branch2Id;
var branch3Id;
var branch4Id;


describe("General database test", function () {  // Runs once before all tests start.
    before("Get agent", function (done) {
        agent = cache.agent;
        done();
    });

    it("Create country 1", function (done) {
        agent
            .post('/country')
            .send(testCountry1)
            .expect(201, function (err, resp) {
                if (err) {
                    return done(err);
                }

                country1Id = resp.body._id;
                done();

            });
    });

    it("Create country 2", function (done) {
        agent
            .post('/country')
            .send(testCountry2)
            .expect(201, function (err, resp) {
                if (err) {
                    return done(err);
                }

                country2Id = resp.body._id;
                done();

            });
    });

    it('Create outlet 1 asigned to created country', function (done) {
        testOutlet1.country = country1Id;
        agent
            .post('/outlet')
            .send(testOutlet1)
            .expect(201, function (err, resp) {
                if (err) {
                    return done(err);
                }
                outlet1Id = resp.body._id;
                done();
            });
    });

    it('Create outlet 2 asigned to created country', function (done) {
        testOutlet2.country = country1Id;
        agent
            .post('/outlet')
            .send(testOutlet2)
            .expect(201, function (err, resp) {
                if (err) {
                    return done(err);
                }
                outlet2Id = resp.body._id;
                done();
            });
    });

    it('Create outlet 3 asigned to created country', function (done) {
        testOutlet3.country = country2Id;
        agent
            .post('/outlet')
            .send(testOutlet3)
            .expect(201, function (err, resp) {
                if (err) {
                    return done(err);
                }
                outlet3Id = resp.body._id;
                done();
            });
    });

    it("Get country 1 and check if new outlet has been added to array", function (done) {
        agent
            .get('/country/' + country1Id)
            .expect(200, function (err, res) {
                var body;

                if (err) {
                    return done(err)
                }

                body = res.body;
                expect(body.outlets).to.include(outlet1Id);
                expect(body.outlets).to.include(outlet2Id);
                done();
            });
    });

    it("Get country 2 and check if new outlet has been added to array", function (done) {
        agent
            .get('/country/' + country2Id)
            .expect(200, function (err, res) {
                var body;

                if (err) {
                    return done(err)
                }

                body = res.body;
                expect(body.outlets).to.include(outlet3Id);

                done();
            });
    });

    it('Create branch 1 asigned to created outlet 1', function (done) {
        testBranch1.outlet = outlet1Id;
        agent
            .post('/branch')
            .send(testBranch1)
            .expect(201, function (err, resp) {
                if (err) {
                    return done(err);
                }
                branch1Id = resp.body._id;
                done();
            });
    });

    it('Create branch 2 asigned to created outlet 1', function (done) {
        testBranch2.outlet = outlet1Id;
        agent
            .post('/branch')
            .send(testBranch2)
            .expect(201, function (err, resp) {
                if (err) {
                    return done(err);
                }
                branch2Id = resp.body._id;
                done();
            });
    });

    it('Create branch 3 asigned to created outlet 2', function (done) {
        testBranch3.outlet = outlet2Id;
        agent
            .post('/branch')
            .send(testBranch3)
            .expect(201, function (err, resp) {
                if (err) {
                    return done(err);
                }
                branch3Id = resp.body._id;
                done();
            });
    });

    it('Create branch 4 asigned to created outlet 2', function (done) {
        testBranch4.outlet = outlet3Id;
        agent
            .post('/branch')
            .send(testBranch4)
            .expect(201, function (err, resp) {
                if (err) {
                    return done(err);
                }
                branch4Id = resp.body._id;
                done();
            });
    });

    it("Get outlet 1 and check if new branches has been added to array", function (done) {
        agent
            .get('/outlet/' + outlet1Id)
            .expect(200, function (err, res) {
                var body;

                if (err) {
                    return done(err)
                }

                body = res.body;
                expect(body.branches).to.include(branch1Id);
                expect(body.branches).to.include(branch2Id);

                done();
            });
    });

    it("Get outlet 2 and check if new branches has been added to array", function (done) {
        agent
            .get('/outlet/' + outlet2Id)
            .expect(200, function (err, res) {
                var body;

                if (err) {
                    return done(err)
                }

                body = res.body;
                expect(body.branches).to.include(branch3Id);
                done();
            });
    });

    it("Get outlet 3 and check if new branches has been added to array", function (done) {
        agent
            .get('/outlet/' + outlet3Id)
            .expect(200, function (err, res) {
                var body;

                if (err) {
                    return done(err)
                }

                body = res.body;
                expect(body.branches).to.include(branch4Id);
                done();
            });
    });

    it("Filter countries by outlet 1 should return country 1", function (done) {
        var filter = {outlets: [outlet1Id]};
        agent
            .post('/country/getBy')
            .send(filter)
            .expect(200, function (err, res) {
                var body;

                if (err) {
                    return done(err)
                }

                body = res.body;
                expect(body[0]._id).to.be.equal(country1Id);
                done();

            })
    });

    it("Filter countries by outlet 2 and 3 should return country 1 and 2", function (done) {
        var filter = {outlets: [outlet1Id, outlet3Id]};
        agent
            .post('/country/getBy')
            .send(filter)
            .expect(200, function (err, res) {
                var body;

                if (err) {
                    return done(err)
                }

                body = res.body;
                expect(body[0]._id).to.be.equal(country1Id);
                expect(body[1]._id).to.be.equal(country2Id);
                done();

            })
    })


});

