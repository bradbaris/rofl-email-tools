'use strict'

const path         = require('path'),
      nodemailer   = require('nodemailer'),
      promptToSend = require('./promptToSend');

module.exports = function (answers, templateDir) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: answers.from, pass: answers.password },
  });

  const template = path.join(templateDir, answers.template);

  promptToSend(transporter, answers.from, answers.to, template);
}
