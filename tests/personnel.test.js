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

var personnelId;
var forgotTokenModel;

describe("BDD for Personnel", function () {  // Runs once before all tests start.
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

    it("Registration new user:", function (done) {
        agent
            .post('/personnel')
            .send(personnelObject)
            .expect(200, function (err, resp) {
                if (err) {
                    return done(err);
                }

                personnelId = resp.body._id;
                done();
            });
    });

    it("Forgot password:", function (done) {
        agent
            .post('/personnel/forgotPass')
            .send({email: personnelObject.email})
            .expect(200, function (err, resp) {
                if (err) {
                    return done(err);
                }

                forgotTokenModel = resp.body;
                done();
            });
    });

    it("Change password:", function (done) {
        agent
            .post('/personnel/passwordChange/' + forgotTokenModel.forgotToken)
            .send({pass: '123456'})
            .expect(200, function (err, resp) {
                if (err) {
                    done(err);
                }

                expect(resp.body.pass).to.be.equal('8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92');
                done();
            });
    });

    it("Try get created personell by id", function (done) {
        agent
            .get('personnel/id' + personnelId)
            .expect(200, function (err, res) {
                var body = res.body;

                if (err) {
                    return done(err);
                }

                expect(body).to.be.instanceOf(Object);
                expect(body._id).to.be.equal(personnelId);
            });
    });

    it("Update personell and check new values in response. PhoneNumber should not change", function (done) {
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
            })
    });

    it("Double check if personell is really updated", function (done) {
        agent
            .get('personnel/id' + personnelId)
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


    it("Delete user:", function (done) {
        agent
            .delete('/personnel/' + personnelId)
            .expect(200, done);
    });

});
