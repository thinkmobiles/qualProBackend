var fs = require('fs');
var expect = require('chai').expect;
var request = require('supertest');

describe("BDD for file writer", function () {

    var file;
    var adminObject = {
        email: 'admin@admin.com',
        pass: '121212'
    };
    var host = process.env.HOST;
    var agent;

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

    it('a file', function (done) {
        agent.post('/upload')
            .set('contenttype', 'personnel')
            .attach('attachfile', 'public/templates/mailer/forgotPassword.html')
            .attach('attachfile', 'public/templates/mailer/createUser.html')
            /*.expect(201)*/
            .end(function (err, res) {
                if(err){
                    return done(err);
                }

                done()
            });
    });
});