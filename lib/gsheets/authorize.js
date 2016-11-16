'use strict';

const fs          = require('fs'),
      googleAuth  = require('google-auth-library');
  let getNewToken = require('./getNewToken');

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 * @param {Object} options The options obj with necessary static paths.
 */
module.exports = function authorize(credentials, callback, options) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(options.TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback, options);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}