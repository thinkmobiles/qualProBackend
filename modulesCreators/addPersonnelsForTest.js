var CONSTANTS = require('../constants/mainConstants');

this.createUsers = function (db) {

    var mongoose = require('mongoose');
    var personnelSchema = mongoose.Schemas[CONSTANTS.PERSONNEL];
    var crypto = require('crypto');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var objectToSave;

    var userObject = {
        pass: '111111',
        firstName: 'Vasya',
        lastName: 'Pupkin',
        dateBirth: new Date('1997-07-03'),
        description: 'User role'
    };

    var shaSum = crypto.createHash('sha256');
    var PersonnelModel = db.model('personnels', personnelSchema);
    var personnelModel;

    shaSum.update(userObject.pass);
    userObject.pass = shaSum.digest('hex');

    for (var i = 0; i <= 7; i++) {
        objectToSave = {};

        objectToSave.description = userObject.description + i;
        objectToSave.position = i;
        objectToSave.lastName = userObject.lastName + i;
        objectToSave.email = 'user' + i + '@user.com';
        objectToSave.firstName = userObject.firstName;

        PersonnelModel.findOne({email: objectToSave.email}, function (err, result) {
            if (err) {
                return console.log(err);
            }

            if (!result) {
                personnelModel = new PersonnelModel(objectToSave);
                personnelModel.save(function (err, personnel) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log('--- User created ---');
                })
            } else {
                console.log('--- User already exists ---');
            }
        })
    }
};