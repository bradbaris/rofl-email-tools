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
module.exports = function createMastheadString(emailType, isFile, addToFilename) {

    let tagline      = [],
        volNumber    = "",
        today        = moment();

    // Check if newsletterType specified in data file exists
    if (!config.newsletterType[emailType]) { 
      throw new Error( 'Invalid Parameter. Valid choices are: ' + Object.keys(config.newsletterType));
    }

    // Calculate Volume/Edition if it has an originDate
    if(config.newsletterType[emailType].originDate) {

      if(config.newsletterType[emailType].interval == "Biweekly") {
        volNumber = today.diff(moment.unix(config.newsletterType[emailType].originDate), 'weeks');
        volNumber /= 2; // Biweekly
        volNumber += 1; // Add one to count current Week
        volNumber = Math.round(volNumber);
      }

      if(config.newsletterType[emailType].interval == "Monthly") {
        volNumber = today.diff(moment.unix(config.newsletterType[emailType].originDate), 'months');
        volNumber += 1; // Add one to count current Month

        // If after the 24th, the email is probably for next month
        if(today.date() >= 24) {
          today.add(1, 'months');
          volNumber += 1;
        }
      }

      // Check if generating filename or masthead
      if(isFile === false) {
        tagline = config.newsletterType[emailType].headline + " - " + today.format("MMMM YYYY") + " - Vol. " + volNumber.toString();
      } else { // Filename optimization
        tagline = [emailType, addToFilename, today.format("MMMYYYY").toLowerCase(), "vol"+volNumber.toString()];
        tagline = tagline.join('_');
        }
        
    } else { 

      // If emailType has no OriginDate, give it a default headline/filename.
      if(isFile === false) {
        tagline = config.newsletterType[emailType].headline;
      } else { // Filename optimization
        tagline = [emailType, addToFilename, today.format("MMMYYYY").toLowerCase()];
        tagline = tagline.join('_');
        }
    }
    return tagline;
}