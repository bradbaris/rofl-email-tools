'use strict'

const fs = require('fs');

module.exports = function(templateDir) {
  const templates = fs.readdirSync(process.cwd()+'/'+templateDir);

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
      message: 'Enter your Gmail account username (not saved)',
    },
    {
      type: 'password',
      name: 'password',
      message: 'Enter your Gmail account password (not saved)',
    },
    {
      type: 'input',
      name: 'to',
      message: 'Enter the recipient email address (not saved)',
    },
    {
      type: 'list',
      name: 'template',
      message: 'Which template do you want to test?',
      choices: templateNames,
      default: 0,
    },
  ];
}
