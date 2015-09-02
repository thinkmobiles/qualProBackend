/**
 * Created by soundstorm on 14.04.15.
 */
module.exports = function () {
    var _ = require('../public/js/libs/underscore/underscore-min.js');
    var nodemailer = require("nodemailer");
    var smtpTransportObject = require('../config/mailer').noReplay;

    var fs = require('fs');
    var forgotPasswordTemplate = _.template(fs.readFileSync('public/templates/mailer/forgotPassword.html', encoding = "utf8"));
    var confirmAccountTemplate = _.template(fs.readFileSync('public/templates/mailer/createUser.html', encoding = "utf8"));

    this.forgotPassword = function (options) {
        var templateOptions = {
            name: options.firstName + ' ' + options.lastName,
            email: options.email,
            url: process.env.HOST + '/passwordChange/' + options.forgotToken
        };
        var mailOptions = {
            from: 'QualPro <no-replay@qualPro.com>',
            to: templateOptions.email,
            subject: 'Change password',
            generateTextFromHTML: true,
            html: forgotPasswordTemplate(templateOptions)
        };

        deliver(mailOptions);
    };

    this.changePassword = function (options) {
        var templateOptions = {
            name: options.firstName + ' ' + options.lastName,
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

    this.confirmNewUserRegistration = function (options) {
        var templateOptions = {
            name: options.firstName + ' ' + options.lastName,
            email: options.email,
            password: options.password,
            url: process.env.HOST + '/personnel/confirm/' + options.token
        };
        var mailOptions = {
            from: 'qualPro <no-replay@qualPro.com>',
            to: options.email,
            subject: 'User verification',
            generateTextFromHTML: true,
            html: confirmAccountTemplate(templateOptions)
        };


        deliver(mailOptions);
    };

    function deliver(mailOptions, cb) {
        var transport = nodemailer.createTransport(smtpTransportObject);

        transport.sendMail(mailOptions, function (err, response) {
            if (err) {
                console.log(err);
                if (cb && (typeof cb === 'function')) {
                    cb(err, null);
                }
            } else {
                console.log("Message sent: " + response.messageId);
                if (cb && (typeof cb === 'function')) {
                    cb(null, response);
                }
            }
        });
    }
};

