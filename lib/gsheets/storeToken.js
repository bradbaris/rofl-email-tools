'use strict';

const fs = require('fs');

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 * @param {Object} options The options obj with necessary static paths.
 */
module.exports = function storeToken(token, options) {
  try {
    fs.mkdirSync(options.TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(options.TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + options.TOKEN_PATH);
}
