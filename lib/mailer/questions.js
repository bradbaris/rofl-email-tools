'use strict'

const fs = require('fs');

/**
 * Collects the necessary data to send out emails via nodemailer.
 * It asks for a GMail login and password, email recipient, email template.
 *
 * Requires shell env var: `source ~/.env`
 *    process.env.TEST_EMAIL_LIST 
 *
 * Optional shell env var (for convenience):
 *    process.env.CHAMINADE_EMAIL
 *
 * Optional shell env var (for convenience):
 *    process.env.CHAMINADE_PW 
 **/
module.exports = function(templateDir) {
  const templates = fs.readdirSync(config.paths.build.index);

  if(!process.env.TEST_EMAIL_LIST || typeof process.env.TEST_EMAIL_LIST === "undefined") {
    throw new Error('No emails loaded. Env var $TEST_EMAIL_LIST should be a string like "email@address.edu,email@address.edu,email@address.edu"');
  } else {
    var emails = process.env.TEST_EMAIL_LIST.split(",");
    console.log("Emails loaded: " + emails);
  }

  if (!templates.length) {
    throw new Error('No templates in directory.');
  }

  const filtered = templates.filter( function(template) {
    return /\.html$/.test(template);
  });

  const templateNames = filtered.map( function(template) {
    return template.replace('.html', '');
  });

  return [
    {
      type: 'input',
      name: 'from',
      message: 'Enter your GMail account username (Loads default from env)',
      default: process.env.CHAMINADE_EMAIL
    },
    {
      type: 'password',
      name: 'password',
      message: 'Enter your GMail account password (Loads default from env)',
      default: process.env.CHAMINADE_PW
    },
    {
      type: 'checkbox',
      name: 'to',
      choices: emails,
      message: 'Who do you want to send test emails to?'
    },
    {
      type: 'list',
      name: 'template',
      message: 'Which template do you want to test?',
      choices: templateNames,
      default: 0
    },
    {
      type: 'input',
      name: 'subject',
      message: 'Enter the test email subject line:'
    }
  ];
}
