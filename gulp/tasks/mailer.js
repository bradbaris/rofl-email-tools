'use strict';

const gulp     = require('gulp'),
      path     = require('path'),
      mailer   = require(path.join(config.paths.lib, 'mailer'));
 
/**
 * Test Mailer
 *
 * Asks you for GMail credentials (not saved), destination email, and template, 
 * then sends out an email via nodemailer.
 **/

module.exports = gulp.task('sendtestemail', function(callback) {
  mailer(config.paths.build.index), callback
});