'use strict';

const gulp   = require('gulp'),
      path   = require('path'),
      del    = require('del');

/* Clean out build folder */
module.exports = gulp.task('clean', function () {
  let options = { nodir: true, /* dryRun: true */ };
  return del([ path.join(config.paths.build.index+'/**/*') ], options)
    .then( function(paths) {
      // If options.dryRun == true, for debugging.
      // console.log('Files and folders that would be deleted:\n', paths.join('\n'));
    });

});