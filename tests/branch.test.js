require('../config/development');

var request = require('supertest');
var Session = require('supertest-session')({
    app: require('../app')
});
var expect = require('chai').expect;

var host = process.env.HOST;
var baseUrl = '/branch';
var agent;
var singular = 'branch';
var plural = 'branches';


var adminObject = {
    _csrf: '',
    email: 'admin@admin.com',
    pass: '121212'
};

var testObject = {
    name: 'test'
};

var objectUpdate = {
    name: 'NotTest'
};

var createdId;

describe("BDD for " + singular, function () {

    var session;

    var csrfToken;
    before(function (done) {
        //agent = request.agent(host);
        session = new Session();
        session.get('/#login')
            .end(function (err, res) {
                if (err) return done(err);

                csrfToken = res.header['set-cookie'][0].split(';')[0].replace('_csrf=', '');
                adminObject._csrf = csrfToken;

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
    });


    //before("Authenticate and get csrf token)", function (done) {
    //    agent = request.agent(host);
    //
    //    agent
    //        .get('/#login')
    //        .expect(200, function (err, resp) {
    //            var body;
    //            agent.get('/authenticated')
    //                .expect(200, function (err, resp) {
    //                    if (err) {
    //                        return done(err);
    //                    }
    //                });
    //            if (err) {
    //                return done(err);
    //            }
    //
    //            body = resp.body;
    //            expect(body).to.be.instanceOf(Object);
    //            done();
    //        });
    //});

// Runs once before all tests start.
//    before("Login: (should return logged personnel)", function (done) {
//        agent = request.agent(host);
//
//        agent
//            .post('/login')
//            .send(adminObject)
//            .expect(200, function (err, resp) {
//                var body;
//                if (err) {
//                    return done(err);
//                }
//
//                body = resp.body;
//                expect(body).to.be.instanceOf(Object);
//                done();
//            });
//    });

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

    it("Get " + singular + " one more time and check if update was successful", function (done) {
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

    it("Archive " + singular, function (done) {
        agent
            .delete(baseUrl + '/' + createdId)
            .expect(200, done);
    });

    it("Try get archived " + singular + " and check archived property object", function (done) {
        agent
            .get(baseUrl + '/' + createdId)
            .expect(200, function (err, res) {
                var body = res.body;

                if (err) {
                    return done(err)
                }
                expect(body).to.be.instanceOf(Object);
                expect(body.isArchived);
                done();
            });
    });
});

