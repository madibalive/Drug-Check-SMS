var parse = require("parse")
var twilio = require('twilio');
var config = require('../config');

// create an authenticated Twilio REST API client
var client = twilio(config.accountSid, config.authToken);

// parse onbject
var Drugs = new Parse.Object.extend("Drugs");
var Reports = new Parse.Object.extend("Reports");

function ctrl() {

    var errorMsgs = 'Something went wrong. Please try again ' +
        'Enter in block letter \'CODE\' followd by the digits';

    function respond(message, sender) {
        var options = {
            to: sender.phone,
            from: config.twilioNumber,
            body: message
        };

        // Send the message!
        client.sendMessage(options, function (err, response) {
            if (err) {
                // Just log it for now
                console.error(err);
            } else {
                // Log the last few digits of a phone number
                var masked = subscriber.phone.substr(0,
                    subscriber.phone.length - 5);
                masked += '*****';
                console.log('Message sent to ' + masked);
            }

        });
    }

    function verifyComplete(message) {
        var intRegex = /^\d+$/;
        if (intRegex.test(str)) {
            return true;
        }
        return false;
    }

    function processHealthStat(data) {
        var success = 0;
        var failed = 0;
        data.forEach(function (report) {
            if (report.statusBoolen) {
                success++
            }
            else {
                failed++
            }
        }, this);

        return {
            "success": success,
            "failed": failed
        }
    }
    // END OF UTIL 

    function webhook(message) {
        var msg, code;                                         // message template
        var payload = request.body;                    // Get the user's phone number

        var CodeRE = /CODE/i;
        var CODE = /[0-9]+/;

        //code =  execute to get number 
        // Try to DRUG  with the given  number
        if (!CodeRE.test(payload.message) && !CODE) {
            msg = 'Sorry, we didn\'t understand that. '
                + 'Enter in block letter \'CODE\' followd by the digits';
            respond(msg, payload.from);
        } else {
            var query = new Parse.Query(drug);              // parse query

            query.equalTo('uniqueId', CODE);
            query.find().then(function (drug) {

                if (!drug) {
                    // If there's no drug associated with this number

                    var report = new Reports();
                    report.set('from', payload.from);
                    report.set('enquiryCode', CODE);
                    report.set('statusBoolean', false);
                    report.set('status', ' CERTIFIED FAILURE');

                    report.save().then(function (report) {
                        msg = 'DRUG IS NOT CERTIFIED. REPORT ID: ' + report.id;
                        respond(msg, payload.phone);
                    }, function (error) {
                        respond(errorMsg, payload.phone)
                    })
                } else {

                    var report = new Reports();
                    report.set('from', payload.from);
                    report.set('enquiryCode', CODE);
                    report.set('statusBoolean', true);
                    report.set('status', ' CERTIFIED SUCCESS');
                    report.save().then(function (report) {
                        msg = 'DRUG IS CERTIFIED. REPORT ID: ' + report.id;
                        respond(msg, payload.phone);
                    }, function (error) {
                        respond(errorMsg, payload.phone)
                    })
                }

            }, function (error) {
                msg = '';
                respond(msg, payload.phone)
            })
        }

    }

    function health(req, res) {
        var reports = new Parse.Query(Reports);
        reports.find().then(function () {
            var processData = processHealthStat();

            res.json(processData);
        })
    }
  
    return {
        webhook: webhook,
        health: health,
    }
}

module.exports = ctrl;