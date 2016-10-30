'use strict';

const fs       = require('fs'),
      gulp     = require('gulp'),
      json2csv = require('json2csv'),
      gutil    = require('gulp-util'),
      requestp = require('request-promise');

const apiFields = ['subscriberKey', 'email', 'name', 'surname', 'type'],
      salesforceFields = ['SubscriberKey', 'EmailAddress', 'FirstName', 'LastName', 'Category'];

const options = {
        json: true,
        uri: process.env.CUH_EMAIL_ENDPOINT,
        headers: { 'Authorization': 'OAuth '+ process.env.CUH_EMAIL_OAUTH }
      };

/**
 * Handle the request to the CUH endpoint,
 * receiving JSON, adding a SubscriberKey for Salesforce,
 * mapping to Salesforce field names, then
 * and saving as CSV for easy import into MarketingCloud.
 *
 * Requires shell env vars: `source ~/.env`
 *    process.env.CUH_EMAIL_ENDPOINT 
 *    process.env.CUH_EMAIL_OAUTH
 **/
module.exports = gulp.task('getEmails', function () {
  if(!process.env.CUH_EMAIL_ENDPOINT || !process.env.CUH_EMAIL_OAUTH) {
    throw new gutil.PluginError('getEmails', 'Missing API Parameters. Need to source the API URI and the OAUTH token.');
  }

  return requestp(options)
    .then(function (body) {

      let emailCsv = body;
      // Clone Email prop as SubscriberKey
      Object.keys(emailCsv).forEach(function (key) {
        emailCsv[key].subscriberKey = emailCsv[key].email;
      });

      // Convert to CSV and save
      emailCsv = json2csv({ data: emailCsv, fields: apiFields, fieldNames: salesforceFields });
      fs.writeFile(config.paths.build.index+"/employee-emails.csv", emailCsv, function(err) {
        if(err) {
          return console.log(err);
        }
        console.log("Employee emails successfully pulled!");
      }); 
    })
    .catch(function (err) {
      return console.log(err);
    });
});