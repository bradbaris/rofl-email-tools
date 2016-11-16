'use strict';

const gulp     = require('gulp'),
      path     = require('path'),
      libxmljs = require('libxmljs'),
      requestp = require('request-promise');
  var litmus   = require(path.join(config.paths.lib, 'litmus'));

/**
 * Litmus Tester
 * Sends built-out emails in /build to Litmus servers for design testing 
 **/

module.exports = gulp.task('litmus', function(callback) {  
  litmus(config.paths.build.index), callback
});