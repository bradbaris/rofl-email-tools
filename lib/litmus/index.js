'use strict';

const inquirer      = require('inquirer'),
      questions     = require('./questions'),
      handleAnswers = require('./answers');

/**
 * Starts the Inquirer questionnaire
 **/

function start(templateDir) {
  inquirer.prompt(questions(templateDir))
  .then(function(answers) {
    handleAnswers(answers, templateDir)
  });
}

module.exports = start;