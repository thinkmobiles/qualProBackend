/**
 * Created by Roman on 15.04.2015.
 */

var sendgridApiKey='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';
var userName="nedstark";
var password="myheadiscutted0";

module.exports.noReplay = {
    host: 'mail.thinkmobiles.com',
    port: 587,
    ignoreTLS: false,
    auth: {
        user: "no-replay@easyerp.com",
        pass: "111111"
    },
    tls: {rejectUnauthorized: false}
};