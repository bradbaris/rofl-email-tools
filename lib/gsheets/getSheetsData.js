'use strict';

const fs         = require('fs'),
      path       = require('path'),
      xray       = require('x-ray'),
      request    = require('request'),
      google     = require('googleapis');
  var template   = require(path.join(config.paths.src.index, 'gsheets_emailconfig.json'));
  var x = new xray();

/**
 * Pulls email articles/events from a specific Google Spreadsheet
 * and parses it out into appropriate JSON struct, and downloads
 * hero images from chaminade.edu/news or events.chaminade.edu
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
module.exports = function getSheetsData(auth) {

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
          if(row[j] === undefined) {
            row[j] = "#"; // Default to keep json struct intact
          }               // and nullify URL errors in build
          if(j==0) { // turn article 'type' lowercase for dev purposes
            row[j] = row[j].toLowerCase();
          }
          if(j==3) { // scrape images from links
            if(row[j].includes("events.chaminade.edu")) {
              x(row[j], 'img.img_big_square@src')(function(err, element) {
                if (err) { console.log(err) }
                element = element.replace(/big_square/i, 'original');
                // local path + remote/filename.ext
                let dest = path.join(config.paths.src.images, path.basename(element));
                request(element).pipe(fs.createWriteStream(dest));
                console.log("Saved image to: " + dest);
              });
            }
            if(row[j].includes("chaminade.edu/article")) {
              x(row[j], '#block-system-main', 'img@src')(function(err, element) {
                if (err) { console.log(err) }
                // local path + remote/filename.ext
                let dest = path.join(config.paths.src.images, path.basename(element));
                request(element).pipe(fs.createWriteStream(dest));
                console.log("Saved image to: " + dest);
              });
            }
          }
          item[titles[j]] = row[j];
        }
        results.push(item);
      }
    }
      // Write file
      template.content = results;

      try {
        fs.writeFileSync(path.join(config.paths.src.index, 'gsheets_emailconfig.json'), JSON.stringify(template, null, '  '));
      } catch (err) {
        console.log('File write failure: ' + err);
      }

  });
}