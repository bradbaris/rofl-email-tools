'use strict'

const send     = require('./send'),
      inquirer = require('inquirer'),
      gutil    = require('gulp-util');

/**
 * Confirms approval to send the email, then proceeds to.
 **/
const promptToSend = function(transporter, from, to, subject, template) {
  inquirer.prompt([{
    type: 'confirm',
    name: 'send',
    default: true,
    message: 'Send test email?',
  }])
  .then( function(sendResponse) {

    if (sendResponse.send) {
      send(template, from, to, subject, transporter, function() {
          gutil.log(gutil.colors.yellow.bold("DONE"));
        });
      }
    });
}

module.exports = promptToSend;