'use strict'

const fs     = require('fs'),
      path   = require('path'),
      litmus = require('./litmus-funcs');

/**
 * Invoke Litmus-API
 **/

module.exports = function (answers, templateDir) {

  var emailString = "";

  fs.readFile(path.join(templateDir,answers.litmus_email), "utf-8", function (err, data) {
    if (err) { 
      console.log('File read failure: ' + err);
      throw err; 
    }
    else {
      // Strip out everything else except <body> ... </body>
      emailString = data.replace(/(.|\n)*?(?=<body)/, '');
      emailString = emailString.replace(/(?=<\/body>)(.|\n)*/, '');
      emailString += '</body>';
      litmus(emailString, answers.litmus_email);
    }
  });
}
