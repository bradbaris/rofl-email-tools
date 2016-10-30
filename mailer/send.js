'use strict'

const fs = require('fs'),
      date = new Date();

module.exports = function(template, from, to, transporter, callback) {
  const subject = "[Draft] "+ (date.getMonth() + 1) + "-" + date.getDate()+ " Email Proof for Art/Copy";
  const templatePath = process.cwd() + template + '.html';
  const html = fs.readFileSync(templatePath, 'utf-8');
  const mailConfig = { from, to, subject, html };

  transporter.sendMail(mailConfig, function(error, info) {
    if (error) { throw new Error(error) }

    console.log('Email successfully sent: '+info.response);

    callback();
  });
}