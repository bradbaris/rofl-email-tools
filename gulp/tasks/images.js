'use strict';

const gulp        = require('gulp'),
      fs          = require('fs'),
      imageResize = require('gulp-image-resize'),
      imagemin    = require('gulp-imagemin'),
      rename      = require("gulp-rename"),
      gutil       = require('gulp-util');

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

  var options = { 
      width : gutil.env.size ?  gutil.env.size : gutil.env.hero ? 600 : 235,
      format: 'jpg',
      noProfile: true,
      imageMagick: true
    }

    return gulp.src(gutil.env.hero ?  gutil.env.hero : config.paths.src.images+'/*.{jpg,png}')
    .pipe(imageResize(options))
    .pipe(imagemin())
    .pipe(rename(function (path) { path.basename += '_'+options.width+'w' }))
    .pipe(gulp.dest(config.paths.build.images));
});