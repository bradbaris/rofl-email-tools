'use strict';

const moment = require('moment');

/**
 * Creates a Masthead string with Subheader, Date, Edition Number
 * Relies on today's date and type of newsletter template (constituency).
 *
 * By default, this creates Masthead string in the format:
 *   {Subheader} - {Month} {Year} - Vol. {Number}
 *
 * If newsletter has no originDate, it returns: {Subheader}.
 **/
function createMastheadString(email, isFile) {

    let tagline      = "",
        volNumber    = "",
        today        = moment();

    // Check if newsletterType specified in data file exists
    if (!config.newsletterType[email]) { 
      throw new gutil.PluginError('Invalid Parameter', 'Valid choices are: ' + Object.keys(config.newsletterType));
    }

    // Calculate Volume/Edition if it has an originDate
    if(config.newsletterType[email].originDate) {

      if(config.newsletterType[email].interval == "Biweekly") {
        volNumber = today.diff(moment.unix(config.newsletterType[email].originDate), 'weeks');
        volNumber /= 2; // Biweekly
        volNumber += 1; // Add one to count current Week
        volNumber = Math.round(volNumber);
      }

      if(config.newsletterType[email].interval == "Monthly") {
        volNumber = today.diff(moment.unix(config.newsletterType[email].originDate), 'months');
        volNumber += 1; // Add one to count current Month

        // If after the 24th, email is probably for next month
        if(today.date() >= 24) {
          today.add(1, 'months');
          volNumber += 1;
        }
      }

      // Check if generating filename or masthead
      if(isFile === false) {
        tagline = config.newsletterType[email].headline + " - " + today.format("MMMM YYYY") + " - Vol. " + volNumber.toString();
      } else { // Filename optimization
        tagline = email +"_" + today.format("MMMYYYY").toLowerCase() + "_vol" + volNumber.toString();
        }
        
    } else { 

      // If email has no OriginDate, give it a default headline/filename.
      if(isFile === false) {
        tagline = config.newsletterType[email].headline;
      } else { 
        tagline = email +"_" + today.format("MMMYYYY").toLowerCase();
        }
    }
    return tagline;
}

module.exports = {
  createMastheadString : createMastheadString
}