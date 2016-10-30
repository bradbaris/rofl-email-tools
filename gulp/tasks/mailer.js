'use strict';

const gulp     = require('gulp'),
      mailer   = require('../../mailer');
 
/**
 * Test Mailer
 * Asks you for Gmail credentials (not saved), destination email, and template, 
 * then sends out an email via nodemailer.
 **/

module.exports = gulp.task('sendmail', function(callback) {
  mailer('/build'), callback
});