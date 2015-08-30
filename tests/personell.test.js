/**
 * Created by Roman on 24.08.2015.
 */
require('../config/development');

var request = require('supertest');
var expect = require('chai').expect;

var host = process.env.HOST;
var url;
var aggent;
var queryString = '';

describe("BDD for personell", function () {  // Runs once before all tests start.
    /*before(function (done) {
     aggent = request.agent(host);

     aggent
     .post('login')
     .send({
     login: 'admin',
     pass: '1q2w3eQWE',
     dbId: 'weTrack'
     })
     .expect(200, done);
     });*/

    /*after(function () {
     url = null;
     agent = null;
     });
     */
    it("login should return object result with key login", function (done) {
        aggent = request.agent(host);
        aggent
            .post('/login')
            .send({
                login: 'admin',
                password: '121212'
            })
            .expect(200, function (err, resp) {
                if (err) {
                    return done(err);
                }

                expect(resp).to.be.instanceOf(Object);
                expect(resp).has.keys('login');
                done();
            });
    });

    it("getAll should return array result", function (done) {
        aggent = request.agent(host);
    });

});
