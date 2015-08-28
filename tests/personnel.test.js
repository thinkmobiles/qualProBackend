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

describe("BDD for User", function () {  // Runs once before all tests start.
    it("login should return logged personnel", function (done) {
        aggent = request.agent(host);

        aggent
            .post('/login')
            .send({
                email: 'admin@admin.com',
                pass: '121212'
            })
            .expect(200, function(err, resp){
                if (err){
                    return done(err);
                }

                expect(resp).to.be.instanceOf(Object);
                /*expect(resp).has.keys('login');*/
                done();
            });
    });

});
