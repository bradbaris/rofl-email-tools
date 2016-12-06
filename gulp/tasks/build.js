'use strict';

const fs           = require('fs'),
      path         = require('path'),
      gulp         = require('gulp'),
      mjml         = require('gulp-mjml'),
      gutil        = require('gulp-util'),
      rename       = require("gulp-rename"),
      inject       = require('gulp-inject-string'),
      detect_img   = require('request-image-size'),
      handlebars   = require('gulp-compile-handlebars'),
      masthead     = require(path.join(config.paths.lib, 'masthead'));

  var data, template, distMasthead, distFilename;
  var hero = {};


handlebars.Handlebars.registerHelper('if_equals', function(a, b, opts) {
  if(a === b) { return opts.fn(this); }
  else { return opts.inverse(this); }
});

/**
 * Used to locate an article type in an array of articles. i.e: 'Hero'
 *
 * Finds if value exists in object array and returns the object it's found in
 * If value is not found, fallback to first object in array.
 **/
function retrieveValue(obj, value) {
  if (Object.keys(obj).some( function(key){ obj[key] == value })) {
    return obj.find( function(element){ return element.type == value});
  } else {
    return obj[0];
  }
}

/**
 * Required tasks to ensure the build succeeds.
 * Heavily documented for convenience.
 **/
gulp.task('pre:build', function() {

  // Check for both params (--data and --template)
  if (!gutil.env.data && !gutil.env.template) {
    throw new gutil.PluginError('pre:build', 'Missing Parameters. Both --data and --template are required fields. Data refers to the JSON file with email content, and template is the template.');
  }

  // Check for required param (--data) and initialize
  if (gutil.env.data) {
    try {
      // Technically `fs` calls Path module already anyway, but oh well
      fs.accessSync(path.join(config.paths.project,gutil.env.data));
    } catch (err) {
        throw new gutil.PluginError('pre:build', 'File Not Found. The --data file could not be found.');
      }
    data = require(path.join(config.paths.project,gutil.env.data));
  } else {
    throw new gutil.PluginError('pre:build', 'Missing Data Parameter. --data is a required field, needed to build email from.');
  }

  // Check for required param (--template) and initialize
  if (gutil.env.template) {
    try {      
      // Technically `fs` calls Path module already anyway, but oh well
      fs.accessSync(path.join(config.paths.project,gutil.env.template));
    } catch (err) {
        throw new gutil.PluginError('pre:build', 'Template Not Found. The --template file could not be found.');
      }
    template = require(path.join(config.paths.project,gutil.env.template));
  } else {
    throw new gutil.PluginError('pre:build', 'Missing template Parameter. --template is a required field, needed to build email from.');
  }

  // Detects hero image for opengraph image height
  hero = retrieveValue(data.content, "Hero");

  let og_image = new Promise( function(resolve, reject) {
    detect_img(hero.image, function(err, dimensions, length) {
      if (err) { return reject(err) }
      return resolve(dimensions);
    });
  }).then( function(result) {
    data.meta.og_image_height = result.height.toString();
    data.meta.og_image_width = result.width.toString();

    // Generate Masthead copy
    data.template.masthead = masthead(data.template.constituency, false, data.template.add_to_filename);
    
    // Check if nameplate_image specified, if not, then default to Alumni (Chaminade News).
    if(config.newsletterType[data.template.constituency].headerImg) {
      data.template.nameplate_image = config.newsletterType[data.template.constituency].headerImg;
    } else { 
      data.template.nameplate_image = config.newsletterType.alumni.headerImg;
    }

    // If good, update JSON file with new values
    fs.writeFileSync(gutil.env.data, JSON.stringify(data, null, '  '));
  }).catch( function(err) {
    throw new gutil.PluginError('pre:build', 'Image file error. If this fails, build-generated data was not written to the data json file');
  });

  // Create final filename for HTML email
  distFilename = masthead(data.template.constituency, true, data.template.add_to_filename);

  // Copy a copy into build for archival
  return gulp.src(gutil.env.data)
      .pipe(rename(function (path) {
        path.basename = "data_"+distFilename;
        path.extname = ".json";
      }))
      .pipe(gulp.dest(config.paths.build.index))

});

/**
 * Compiles Handlebars => MJML => HTML
 * Inserts raw HTML meta tags (not yet supported in MJML)
 * Inserts Litmus email tracking snippet
 * Inserts Salesforce email tracking snippet
 **/
gulp.task('build', ['pre:build'], function () {
  return gulp.src(gutil.env.template)
    .pipe(handlebars(data, {batch:[path.join(config.paths.project,'templates/partials')]}))
    .pipe(mjml())
    .pipe(inject.after( // Insert OpenGraph Meta tags for Facebook/Twitter
                        // Twitter currently doesnt work due to robots.txt issue...
      '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">',
      '<meta property="og:url" content="'+data.meta.og_twtr_url+'" />'+
      '<meta property="og:title" content="'+data.template.masthead+'" />'+
      '<meta property="og:description" content="'+data.meta.og_twtr_desc+'" />'+
      '<meta property="og:image" content="'+hero.image+'" />'+
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
      '<meta name="og:twitter:image" content="'+hero.image+'" />'))
      // **Litmus Tracking Snippet**
      // This code needs to be refreshed every month if you want it to collect data accurately
      // but this isn't a high priority at the moment, despite additional metrics.
      // -- All you have to replace are all instances of the unique 8-char code:
      //      i.e. --> [6jpwho0j].emltrk.com
    .pipe(inject.before('</body>','<style data-ignore-inlining>@media print{ #_t { background-image: url(\'https://6jpwho0j.emltrk.com/6jpwho0j?p&d=%%emailaddr%%\');}} div.OutlookMessageHeader {background-image:url(\'https://6jpwho0j.emltrk.com/6jpwho0j?f&d=%%emailaddr%%\')} table.moz-email-headers-table {background-image:url(\'https://6jpwho0j.emltrk.com/6jpwho0j?f&d=%%emailaddr%%\')} blockquote #_t {background-image:url(\'https://6jpwho0j.emltrk.com/6jpwho0j?f&d=%%emailaddr%%\')} #MailContainerBody #_t {background-image:url(\'https://6jpwho0j.emltrk.com/6jpwho0j?f&d=%%emailaddr%%\')}</style><div id="_t"></div><img src="https://6jpwho0j.emltrk.com/6jpwho0j?d=%%emailaddr%%" width="1" height="1" border="0" />'))
      // Add Salesforce Tracking Snippet
    .pipe(inject.before('</body>','<custom name="opencounter" type="tracking">'))
    .pipe(rename(function (path) {
        path.basename = "FINAL_"+distFilename;
        path.extname = ".html";
      }))
    .pipe(gulp.dest(config.paths.build.index))
});

module.exports = {
  'pre:build' : 'pre:build',
  'build' : 'build'
}