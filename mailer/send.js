'use strict'

const fs = require('fs');

/**
 * Sends the emails out
 **/
module.exports = function(template, from, to, subject, transporter, callback) {
  const templatePath = process.cwd() + template + '.html';
  const html = fs.readFileSync(templatePath, 'utf-8');
  const mailConfig = { from, to, subject, html };

  transporter.sendMail(mailConfig, function(error, info) {
    if (error) { throw new Error(error) }

    console.log('Email successfully sent: '+info.response);

    callback();
  });
}