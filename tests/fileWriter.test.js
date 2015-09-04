var LocalFs = require('../helpers/localFs');
var fs = require('fs');
var folderName = '/myFolder/sfd';

var createdId;

describe("BDD for file writer" , function () {  // Runs once before all tests start.

    it("write file", function (done) {

        var l=LocalFs;

        var localFs=LocalFs();
        localFs.getFilePath('ertert','erter');
        var file = fs.readFileSync('public/templates/mailer/forgotPassword.html', encoding = "utf8")
        localFs.postFile(folderName, "sdfs", {data: file}, function (err, res) {
            console.log(err);
            console.log(res);
            done();
        });
    });


});