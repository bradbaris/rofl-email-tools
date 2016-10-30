'use strict';

const fs           = require('fs'),
      gulp         = require('gulp'),
      mjml         = require('gulp-mjml'),
      gutil        = require('gulp-util'),
      rename       = require("gulp-rename"),
      inject       = require('gulp-inject-string'),
      detect_img   = require('request-image-size'),
      handlebars   = require('gulp-compile-handlebars'),
      masthead     = require('./createMastheadString');

  var data, template, distMasthead, distFilename;

/**
 * Required tasks to ensure the build succeeds.
 * Heavily documented for convenience.
 **/
module.exports = gulp.task('pre:build', function() {

  // Check for both params (--data and --template)
  if (!gutil.env.data && !gutil.env.template) {
    throw new gutil.PluginError('pre:build', 'Missing Parameters. Both --data and --template are required fields. Data refers to the JSON file with email content, and template is the template.');
  }

  // Check for required param (--data) and initialize
  if (gutil.env.data) {
    try {
      fs.accessSync(config.paths.project+gutil.env.data);
    } catch (err) {
        throw new gutil.PluginError('pre:build', 'File Not Found. The --data file could not be found.');
      }
    data = require(config.paths.project+gutil.env.data);
  } else {
    throw new gutil.PluginError('pre:build', 'Missing Data Parameter. --data is a required field, needed to build email from.');
  }

  // Check for required param (--template) and initialize
  if (gutil.env.template) {
    try {
      fs.accessSync(config.paths.project+gutil.env.template);
    } catch (err) {
        throw new gutil.PluginError('pre:build', 'Template Not Found. The --template file could not be found.');
      }
    template = require(config.paths.project+gutil.env.template);
  } else {
    throw new gutil.PluginError('pre:build', 'Missing template Parameter. --template is a required field, needed to build email from.');
  }

  // Detects hero image for opengraph image height  
  let og_image = new Promise( function(resolve, reject) {
    detect_img(data.hero.image, function(err, dimensions, length) {
      if (err) { return reject(err) }
      return resolve(dimensions.height.toString());
    });
  }).then( function(result) {
    data.meta.og_image_height = result;

    // Generate Masthead copy
    data.template.masthead = masthead.createMastheadString(data.template.constituency, false);
    
    // Check if nameplate_image specified, if not, then blank.
    if(config.newsletterType[data.template.constituency].headerImg) {
      data.template.nameplate_image = config.newsletterType[data.template.constituency].headerImg;
    } else { data.template.nameplate_image = "" }

    // If good, update JSON file with new values
    fs.writeFileSync(gutil.env.data, JSON.stringify(data, null, '  '));
  }).catch( function(err) {
    throw new gutil.PluginError('pre:build', 'Ensure `data.hero.image` is valid. If this fails, build-generated data was not written to the data.json');
  });

  // Create final filename for HTML email
  distFilename = masthead.createMastheadString(data.template.constituency, true);

  // Copy a copy into build for archival
  return gulp.src(gutil.env.data)
      .pipe(rename(function (path) {
        path.basename = "data_"+distFilename;
        path.extname = ".json";
      }))
      .pipe(gulp.dest(config.paths.build.index))

});

/**
 * Compiles Handlebars => MJML => HTML,
 * Inserts raw HTML meta tags (not yet supported in MJML),
 * Inserts Salesforce email tracking snippet
 **/
module.exports = gulp.task('build', ['pre:build'], function () {
  return gulp.src(gutil.env.template)
    .pipe(handlebars(data, {batch:[config.paths.project+'templates/partials']}))
    .pipe(mjml())
    .pipe(inject.after( // INSERT OPENGRAPH META TAGS
      '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">',
      '<meta property="og:url" content="'+data.meta.og_twtr_url+'" />'+
      '<meta property="og:title" content="'+data.template.masthead+'" />'+
      '<meta property="og:description" content="'+data.meta.og_twtr_desc+'" />'+
      '<meta property="og:image" content="'+data.hero.image+'" />'+
      '<meta property="og:image:type" content="'+data.meta.og_image_type+'" />'+
      '<meta property="og:image:width" content="'+data.meta.og_image_width+'" />'+
      '<meta property="og:image:height" content="'+data.meta.og_image_height+'" />'+
      '<meta property="og:type" content="'+data.meta.og_type+'" />'+
      '<meta property="og:type:article:author" content="'+data.meta.og_type_article_author+'" />'+
      '<meta property="og:locale" content="'+data.meta.og_locale+'" />'+
      '<meta name="og:twitter:card" content="'+data.meta.twtr_card+'" />'+
      '<meta name="og:twitter:title" content="'+data.template.masthead+'" />'+
      '<meta name="og:twitter:description" content="'+data.meta.og_twtr_desc+'" />'+
      '<meta name="og:twitter:url" content="'+data.meta.og_twtr_url+'" />'+
      '<meta name="og:twitter:image" content="'+data.hero.image+'" />'))
      // ADD IN SALESFORCE TRACKING SNIPPET
    .pipe(inject.before('</body>','<custom name="opencounter" type="tracking">'))
    .pipe(rename(function (path) {
        path.basename = "FINAL_"+distFilename;
        path.extname = ".html";
      }))
    .pipe(gulp.dest(config.paths.build.index))
});