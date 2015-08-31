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
    lastName: 'Pupkin'
};


var newNameOfPersonell = "Bilbo";
var newLastNameOfPersonell = "Baggins";
var newDateOfBirdthOfPersonell = new Date(1988, 10, 12);
var newEmailOfPersonell = 'theshire@mail.com'
var newPhoneNumberOfPersonell = '9988776655';
var newDescriptionOfPersonell = "A Elbereth Gilthoniel,\nsilivren penna miriel \no menel aglar elenath! \nNa-chaered palan-diriel\no galadhremmin ennorath,\nFanuilos, le linnathon\nve linde le ca Valiman\nnef aear, si nef aearon!"
var newPositionOfPersonell = 1;

var personnelId;


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
            .get('/personnel/forgot/' + personnelId)
            .expect(200, done);
    });


    it("Try get created personell by id", function(done){
        agent
            .get('personnel/id'+personnelId)
            .expect(200,function(err,res){
                var body=res.body;

                if (err) {
                    return done(err);
                }

                expect(body).to.be.instanceOf(Object);
                expect(body._id).to.be.equal(personnelId);
            });
    });

    it("Update personell and check new values in response. Password should not change", function (done) {
        agent
            .put('/personnel/id' + personnelId)
            .send(
            {
                firstName: newNameOfPersonell,
                lastName: newLastNameOfPersonell,
                birthDate: newDateOfBirdthOfPersonell,
                email: newEmailOfPersonell,
                phoneNumber: newPhoneNumberOfPersonell,
                description: newDescriptionOfPersonell,
                position: newPositionOfPersonell
            })
            .expect(200, function(err,res){
                var body=res.body;

                if (err) {
                    return done(err);
                }

                expect(body).to.be.instanceOf(Object);
                expect(body.firstName).to.be.equal(newNameOfPersonell);
                expect(body.lastName).to.be.equal(newLastNameOfPersonell);
                expect(body.birthDate).to.be.equal(newDateOfBirdthOfPersonell);
                expect(body.email).to.be.equal(newEmailOfPersonell);
                expect(body.phoneNumber).to.be.equal(newPhoneNumberOfPersonell);
                expect(body.description).to.be.equal(newDescriptionOfPersonell);
                expect(body.position).to.be.equal(newPositionOfPersonell);
                expect(body.pass).to.be.equal(personnelObject.pass);
            })
    });

    it("Double check if personell is really updated", function(done){
        agent
            .get('personnel/id'+personnelId)
            .expect(200,function(err,res){
                var body=res.body;

                if (err) {
                    return done(err);
                }

                expect(body).to.be.instanceOf(Object);
                expect(body.firstName).to.be.equal(newNameOfPersonell);
                expect(body.lastName).to.be.equal(newLastNameOfPersonell);
                expect(body.birthDate).to.be.equal(newDateOfBirdthOfPersonell);
                expect(body.email).to.be.equal(newEmailOfPersonell);
                expect(body.phoneNumber).to.be.equal(newPhoneNumberOfPersonell);
                expect(body.description).to.be.equal(newDescriptionOfPersonell);
                expect(body.position).to.be.equal(newPositionOfPersonell);
                expect(body.pass).to.be.equal(personnelObject.pass);
            });
    });


    it("Delete user:", function (done) {
        agent
            .delete('/personnel/' + personnelId)
            .expect(200, done);
    });

});
