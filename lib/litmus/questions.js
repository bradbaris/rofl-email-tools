'use strict'

const fs = require('fs');

/**
 * Select email to sent to Litmus for email design testing
 *
 **/
module.exports = function(templateDir) {
  const templates = fs.readdirSync(config.paths.build.index);

  if (!templates.length) {
    throw new Error('No templates in directory.');
  }

  const templateNames = templates.filter( function(template) {
    return /\.html$/.test(template);
  });

  return [
    {
      type: 'list',
      name: 'litmus_email',
      message: 'Which email do you want to test with Litmus?',
      choices: templateNames,
      default: 0
    }
  ];
}
