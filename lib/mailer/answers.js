'use strict'

const path         = require('path'),
      nodemailer   = require('nodemailer'),
      promptToSend = require('./promptToSend');

/**
 * Takes the answers from Inquirer, logs into the email
 * server and then proceeds to prompt before sending it out
 **/
module.exports = function (answers, templateDir) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: answers.from, pass: answers.password },
  });

  const template = path.join(templateDir, answers.template);

  promptToSend(transporter, answers.from, answers.to, answers.subject, template);
}
