'use strict';

/**
 * https://developers.google.com/sheets/quickstart/nodejs
 */

const fs             = require('fs'),
      path           = require('path');
  let authorize      = require('./authorize'),
      getSheetsData = require('./getSheetsData');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheet-googleapi-chaminade-email-template.json
const options = {};
      options.SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
      options.TOKEN_DIR = config.paths.project;
      options.TOKEN_PATH = path.join(config.paths.project, '.chaminade-googlesheets-token.json');

module.exports = function getSecret() {
  // Load client secrets from a local file.
  fs.readFile(path.join(config.paths.project, '/lib/gsheets/', 'client_secret.json'), function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Google Sheets API.
    authorize(JSON.parse(content), getSheetsData, options);
  });
}