/***************************************
 *
 *  Gulp Task Overview:
 *
 *  A)  BUILD EMAIL
 *      The --data and --template parameters are REQUIRED.
 *      Run `gulp --data src/{datasource.json} --template {templates/template.hbs}`
 *
 *  B)  RESIZE/PROCESS IMAGES
 *      The --hero and --size parameters are OPTIONAL.
 *      Run `gulp images [--hero src/images/{imagefile} --size ###]`
 *
 *  C)  PULL FRESH EMAIL LIST (Faculty/Staff/Adjuncts) 
 *      Run `gulp getEmails`
 *
 *  D)  WHAT GULP DOES NOT DO
 *      It doesn't copy your emails into Salesforce MarketingCloud.
 *      And you still have to manually write the Email Subject.
 *
 **************************************/

require('./gulp');
