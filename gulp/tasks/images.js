'use strict';

const fs          = require('fs'),
      path        = require('path'),
      gulp        = require('gulp'),
      gutil       = require('gulp-util'),
      rename      = require("gulp-rename"),
      imagemin    = require('gulp-imagemin'),
      imageResize = require('gulp-image-resize');

/**
 * Formats Images
 * Default behavior: resizes images to 235px for newsletter article thumbnails
 * 
 * Optional param: --hero {src/images/filename.jpg|png}
 *     Resizes an image to 600px width for use as email hero image.
 *     Width can be overridden by --size param.
 *
 * Optional param: --size ###
 *     Resizes images to specified size
 **/

module.exports = gulp.task('images', function () {

  if(gutil.env.size && typeof gutil.env.size !== 'number') {
    throw new gutil.PluginError('images', 'The --size param should be a number.');
  }
  if(gutil.env.hero) {
    try {
      fs.accessSync(config.paths.project+gutil.env.hero);
    } catch (err) {
        throw new gutil.PluginError('images', 'File Not Found. The --hero image file could not be found.');
      }
  }

  var options = { 
      width : gutil.env.size ?  gutil.env.size : gutil.env.hero ? 600 : 235,
      format: 'jpg',
      noProfile: true,
      imageMagick: true
    }

    return gulp.src(gutil.env.hero ?  gutil.env.hero : path.join(config.paths.src.images,'*.{jpg,png}'))
    .pipe(imageResize(options))
    .pipe(imagemin())
    .pipe(rename(function (path) { path.basename += '_'+options.width+'w' }))
    .pipe(gulp.dest(config.paths.build.images));
});