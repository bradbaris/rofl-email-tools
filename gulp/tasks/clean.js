'use strict';

const gulp   = require('gulp'),
      del    = require('del');

/* Clean out build folder */
module.exports = gulp.task('clean', function () {
  let options = { nodir: true };
  return del([ config.paths.build.index+'/**/*'], options);
});