'use strict';

const fs         = require('fs'),
      path       = require('path'),
      google     = require('googleapis');
  var template   = require(path.join(config.paths.src.index, 'gsheets_emailconfig.json'));

/**
 * Pulls email articles/events from a specific Google Spreadsheet
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
module.exports = function getEmailFields(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1Re4xTadmIHnh5aNmxOM2YuAAMDKdrlfHtH4mZH2IoOE',
    range: 'Template!A1:E'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values;
    if (rows.length == 0) {
      console.log('No data found.');
    } else {
      var results = [];
      var titles = [];
      // Populate headers
      for (var h = 0; h < rows[0].length; h++) {
        titles.push(rows[0][h].toLowerCase());
      }
      // Populate objects using terrible nested for-loop.
      // Array comprehension ...
      for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var item = {};

        // Limited to width of matrix
        for (var j = 0; j < rows[0].length; j++) {
          if(row[j] === undefined){
            row[j] = "#"; // Default to keep json struct intact
          }               // and nullify URL errors in build
          if(j==0){ // turn article 'type' lowercase for dev purposes
            row[j] = row[j].toLowerCase();
          }
          item[titles[j]] = row[j];
        }
        results.push(item);
      }

      // Write file
      template.content = results;
      try {
        fs.writeFileSync(path.join(config.paths.src.index, 'gsheets_emailconfig.json'), JSON.stringify(template, null, '  '));
      } catch (err) {
        console.log('File write failure: ' + err);
      };


    }
  });
}