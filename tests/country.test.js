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

var country={
name:'Laplandy',
    description:'Home of Santa Claus',
    manager:null
};
var createdId;

describe("BDD for country", function () {  // Runs once before all tests start.
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

    it("Create new country:", function (done) {
        agent
            .post('/country')
            .send(country)
            .expect(200, function(err, resp) {
                if (err) {
                    return done(err);
                }

                createdId = resp.body._id;
                done();

            });
    });

    it("Get country by id",function(done){
        agent
            .get('/country/'+createdId)
            .expect(200,function(error,response){
                if (error){
                    return done(error)}
                expect(response).to.be.instanceOf(Object);
                expect(response.body._id).to.be.equal(createdId);
                done();
            });
    });

    it ("Get all countries", function(done){
        agent
            .get('/country')
            .expect(200,function(error,response){
                if (error){
                    return done(error)}
                expect(response.body).to.be.instanceOf(Array);
                done();
            });
    });

    it("Delete country:", function (done) {
        agent
            .delete('/country/' + createdId)
            .expect(200, done);
    });

    /*
    it("Delete country:", function (done) {
        agent
            .delete('/country/' + createdId)
            .expect(200, done);
    });

*/
});