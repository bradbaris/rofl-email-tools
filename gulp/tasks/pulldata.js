'use strict';

const gulp     = require('gulp'),
      path     = require('path'),
      gsheets  = require(path.join(config.paths.lib, 'gsheets'));
 
/**
 * Pull Data
 *
 * Extracts email field data from a specific Google Sheets doc 
 * and converts it to JSON to feed into the email template.
 **/

module.exports = gulp.task('pulldata', function(callback) {
  gsheets, callback
});