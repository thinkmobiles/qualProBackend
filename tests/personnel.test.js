/**
 * Created by Roman on 24.08.2015.
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

var personnelObject = {
    email: 'soundstorm.mail@gmail.com',
    pass: '111111',
    firstName: 'Ivan',
    lastName: 'Pupkin',
    phoneNumber: '345345'
};


var newNameOfPersonell = "Bilbo";
var newLastNameOfPersonell = "Baggins";
var newDateOfBirdthOfPersonell = new Date(1988, 10, 12);
var newEmailOfPersonell = 'theshire@mail.com';

var newDescriptionOfPersonell = "A Elbereth Gilthoniel,\nsilivren penna miriel \no menel aglar elenath! \nNa-chaered palan-diriel\no galadhremmin ennorath,\nFanuilos, le linnathon\nve linde le ca Valiman\nnef aear, si nef aearon!";
var newPositionOfPersonell = 1;
var cache=require('./helpers/cache');
var personnelId;
var forgotTokenModel;
var token;

describe("BDD for Personnel", function () {  // Runs once before all tests start.
    before("Get agent", function (done) {
        agent = cache.agent;
        var countries=cache.countries;
        personnelObject.country=countries[0]._id;
        done();
    });

    it("Registration new user:", function (done) {
        agent
            .post('/personnel')
            .send(personnelObject)
            .expect(201, function (err, resp) {
                if (err) {
                    return done(err);
                }

                personnelId = resp.body._id;
                done();
            });
    });

    //it("Forgot password:", function (done) {
    //    agent
    //        .post('/personnel/forgotPass')
    //        .send({email: personnelObject.email})
    //        .expect(200, function (err, resp) {
    //            if (err) {
    //                return done(err);
    //            }
    //            agent
    //                .get('/personnel/' + resp.body._id)
    //                .expect(200, function (err, res) {
    //                    if (err) {
    //                        return done(err);
    //                    }
    //
    //                    forgotTokenModel = res.body;
    //                    done();
    //                });
    //        });
    //});
    //
    //it("Change password:", function (done) {
    //    agent
    //        .post('/personnel/passwordChange/' + forgotTokenModel.forgotToken)
    //        .send({pass: '123456'})
    //        .expect(200, function (err, resp) {
    //            if (err) {
    //                done(err);
    //            }
    //
    //            agent
    //                .get('/personnel/' + forgotTokenModel._id)
    //                .expect(200, function (err, res) {
    //                    if (err) {
    //                        return done(err);
    //                    }
    //                    done();
    //                });
    //        });
    //});

    it("Try get created personnel by id", function (done) {
        agent
            .get('/personnel/' + personnelId)
            .expect(200, function (err, res) {
                var body = res.body;

                if (err) {
                    return done(err);
                }

                expect(body).to.be.instanceOf(Object);
                expect(body._id).to.be.equal(personnelId);
                expect(body).not.to.have.property('pass');
                token = body.token;
                done();
            });
    });

    it("Confirm registration", function (done) {

        agent
            .get('/personnel/confirm/token=' + token)
            .expect(302, function (err, res) {
                if (err) {
                    return done(err);
                }
                //todo check url somehow. Below statement not working
                //expect(res.text.contains(host+'/#login'));
                done();
            })

    });

    it("Update personell and wait for success", function (done) {
        agent
            .put('/personnel/' + personnelId)
            .send(
            {
                firstName: newNameOfPersonell,
                lastName: newLastNameOfPersonell,
                dateBirth: newDateOfBirdthOfPersonell,
                email: newEmailOfPersonell,
                description: newDescriptionOfPersonell,
                position: newPositionOfPersonell
            })
            .expect(200, function (err, res) {
                if (err) {
                    return done(err);
                }
                done();
            });
    });

    it("Double check if personell is really updated", function (done) {
        agent
            .get('/personnel/' + personnelId)
            .expect(200, function (err, res) {
                var body = res.body;

                if (err) {
                    return done(err);
                }

                expect(body).to.be.instanceOf(Object);
                expect(body.firstName).to.be.equal(newNameOfPersonell);
                expect(body.lastName).to.be.equal(newLastNameOfPersonell);
                expect(body.email).to.be.equal(newEmailOfPersonell);
                expect(body.phoneNumber).to.be.equal(personnelObject.phoneNumber);
                expect(body.description).to.be.equal(newDescriptionOfPersonell);
                expect(body.position).to.be.equal(newPositionOfPersonell);

                done();
            });
    });

    it("Get all persons", function (done) {
        agent
            .get('/personnel')
            .expect(200, function (err, res) {
                if (err) {
                    return done(err)
                }
                expect(res.body.data).to.be.instanceOf(Array);
                expect(res.body.data.length).to.be.least(1);

                done();
            });
    });


    it("Delete user:", function (done) {
        agent
            .delete('/personnel/' + personnelId)
            .expect(200, done);
    });

});
