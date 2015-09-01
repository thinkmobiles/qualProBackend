/**
 * Created by soundstorm on 14.04.15.
 */
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var options = {
    auth: {
        api_user: 'nedstark',
        api_key: 'myheadiscutted0'
    }
}
var client = nodemailer.createTransport(sgTransport(options));

var _ = require('../public/js/libs/underscore/underscore-min');
//var nodemailer = require("nodemailer");
// var smtpTransportObject = require('../config/mailer').noReplay;

var fs = require('fs');

var Mailer = function () {

    this.forgotPassword = function (options) {
        var templateOptions = {
            name: options.firstName + ' ' + options.lastName,
            email: options.email,
            url: 'http://easyerp.com/password_change/?forgotToken=' + options.forgotToken
        };
        var mailOptions = {
            from: 'easyerp <no-replay@qualpro.com>',
            to: templateOptions.email,
            subject: 'Change password',
            generateTextFromHTML: true,
            html: _.template(fs.readFileSync('public/templates/mailer/forgotPassword.html', encoding = "utf8"), templateOptions)
        };

        deliver(mailOptions);
    };

    this.changePassword = function (options) {
        var templateOptions = {
            name: options.firstname + ' ' + options.lastname,
            email: options.email,
            password: options.password,
            url: 'http://localhost:8823'
        };
        var mailOptions = {
            from: 'Test',
            to: options.email,
            subject: 'Change password',
            generateTextFromHTML: true,
            html: _.template(fs.readFileSync('public/templates/mailer/changePassword.html', encoding = "utf8"), templateOptions)
        };

        deliver(mailOptions);
    };

    this.registeredNewUser = function (options) {
        var templateOptions = {
            name: options.firstName + ' ' + options.lastName,
            email: options.email,
            country: options.countryInput,
            city: options.city
        };
        var mailOptions = {
            from: 'easyerp <no-replay@qualpro.com>',
            to: 'sales@easyerp.com',
            subject: 'new user',
            generateTextFromHTML: true,
            html: _.template(fs.readFileSync('public/templates/mailer/registeredNewUser.html', encoding = "utf8"), templateOptions)
        };

        var mailOptionsUser = {
            from: 'easyerp <support@qualpro.com>',
            to: templateOptions.email,
            subject: 'New registration',
            generateTextFromHTML: true,
            html: _.template(fs.readFileSync('public/templates/mailer/newUser.html', encoding = "utf8"), templateOptions)
        };

        deliver(mailOptionsUser);
        deliver(mailOptions);
    };

    function deliver(mailOptions, cb) {
        //var transport = nodemailer.createTransport(smtpTransportObject);
        //
        //transport.sendMail(mailOptions, function (err, response) {
        //    if (err) {
        //        console.log(err);
        //        if (cb && (typeof cb === 'function')) {
        //            cb(err, null);
        //        }
        //    } else {
        //        console.log("Message sent: " + response.message);
        //        if (cb && (typeof cb === 'function')) {
        //            cb(null, response);
        //        }
        //    }
        //});
        client.sendMail(mailOptions, function (err, response) {
            if (err) {
                cb(error, null);
            }
            else {
                res.status(200).send(response);
                cb(null, response);
            }
        });
    }

};

module.exports = Mailer();

