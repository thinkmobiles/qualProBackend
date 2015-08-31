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
            .expect(200, function(err, resp) {
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
            .expect(200, done);
    })

    it("Delete user:", function (done) {
        agent
            .delete('/personnel/' + personnelId)
            .expect(200, done);
    });

});
