'use strict'

const inquirer      = require('inquirer'),
      questions     = require('./questions'),
      handleAnswers = require('./answers');

module.exports = function(templateDir) {
  inquirer.prompt(questions(templateDir))
  .then(answers => handleAnswers(answers, templateDir));
}
