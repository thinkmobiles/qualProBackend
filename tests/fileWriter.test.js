var LocalFs = require('../helpers/localFs');
var fs = require('fs');
var expect = require('chai').expect;

var folderName = '/myFolder/sfd';

describe("BDD for file writer", function () {

    it("write file should return no errors", function (done) {
        var file;
        var localFs = new LocalFs();

        file = fs.readFileSync('public/templates/mailer/forgotPassword.html', encoding = "utf8");

        localFs.postFile(folderName, "sdfs.html", {data: file}, function (err) {
            expect(!err);
            done();
        });

    });

    });
});