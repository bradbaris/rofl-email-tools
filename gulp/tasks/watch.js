'use strict'

const gulp     = require('gulp'),
      path     = require('path'),
      gutil    = require('gulp-util'),
      sequence = require('run-sequence');

/* Clear require() cache in order to require() again, after changes */
function requireUncached(module){
  delete require.cache[require.resolve(module)];
  return require(module);
}

/* Watch for changes in the already-given data and template files */
module.exports = gulp.task('watch', function() {
  // Hacky fix: setTimeout to avoid triggering watch on the pre:build step
  setTimeout(function() {

    gulp.watch(config.paths.project + gutil.env.data, function() {
      requireUncached(path.join(config.paths.project,gutil.env.data));
      sequence('default');
    });

    gulp.watch(config.paths.project + gutil.env.template, function() {
      requireUncached(path.join(config.paths.project,util.env.template));
      sequence('default');
    });  
  }, 2000);
});