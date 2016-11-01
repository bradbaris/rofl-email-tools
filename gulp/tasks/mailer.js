'use strict';

const gulp     = require('gulp'),
      mailer   = require('../../mailer');
 
/**
 * Test Mailer
 * Asks you for GMail credentials (not saved), destination email, and template, 
 * then sends out an email via nodemailer.
 **/

module.exports = gulp.task('sendTestEmail', function(callback) {
  mailer('/build'), callback
});