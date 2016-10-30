'use strict'

  var flag     = true,
      ucmlist  = "";
const send     = require('./send'),
      inquirer = require('inquirer'),
      gutil    = require('gulp-util');

const promptToSend = function(transporter, from, to, template) {
  inquirer.prompt([{
    type: 'confirm',
    name: 'send',
    default: true,
    message: 'Send test email?',
  }])
  .then( function(sendResponse) {

    if (sendResponse.send) {
      send(template, from, to, transporter, function() {

        if(flag) {
          flag = false;

          /* Load internal UCM email list */
          ucmlist  = process.env.UCM_INTERNAL;

          gutil.log(gutil.colors.bold("Ready to send to UCM Internal list."));
          gutil.log(gutil.colors.green(ucmlist));
          promptToSend(transporter, from, ucmlist, template);
        } else {
          gutil.log(gutil.colors.yellow.bold("DONE"));
        }
      });
    }
  });
}

module.exports = promptToSend;