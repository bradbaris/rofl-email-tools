'use strict';

const readline   = require('readline');
  let storeToken = require('./storeToken');

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 * @param {Object} options The options obj with necessary static paths.
 */
module.exports = function getNewToken(oauth2Client, callback, options) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: options.SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token, options);
      callback(oauth2Client);
    });
  });
}
