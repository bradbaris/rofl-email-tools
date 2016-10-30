# Chaminade Email Newsletter Templates
[![UCM](https://img.shields.io/badge/Department-UCM-blue.svg)](https://www.chaminade.edu)  

A little inhouse email templating workflow based on [MJML](https://mjml.io/), [Handlebars](http://handlebarsjs.com/), and [Gulp](http://gulpjs.com/). Uses [Nodemailer](https://nodemailer.com/) for fast test emails.

Just have to fill out `src/emailconfig.json` with email content, then select the appropriate template from `/templates` and feed it into gulp as parameters, for example: 
  ```
  gulp --data src/emailconfig.json --template templates/newsletter_master.hbs
  ```

## Gulp Task Overview:

### Compile Email  
The `--data` and `--template` parameters are _REQUIRED_.
  ```
  gulp --data {src/emailconfig.json} --template {templates/templateName.hbs}
  ```

### Resize and process images  
The `--hero` and `--size` parameters are _OPTIONAL_.  
Hero images default to `600px` wide and can be overridden with `--size`.
  ```
  gulp images [--hero src/images/{imagefile.jpg|png} --size ###]
  ```

### Send test email  
Sends out a test email via Gmail via nodemailer. Asks you for credentials (not saved), destination email, and template.
  ```
  gulp sendmail
  ```

### Pull a fresh email list (for Faculty/Staff/Adjuncts)
  ```
  gulp getEmails
  ```

### What Gulp doesn't do  
- Does not upload your images into Salesforce MarketingCloud.
- Does not create your emails in Salesforce MarketingCloud either.
- After that, you have to copy the HTML email in, write in the email subject, and use the GUI to send emails.

### Features currently exploring
- Salesforce [AMPscript](https://help.marketingcloud.com/en/documentation/ampscript/ampscript_syntax_guide/) logic and integration features. Social Forwarding?
- May be possible to connect to Salesforce Marketing Cloud via their [FUEL SDK for Node](https://github.com/salesforce-marketingcloud/FuelSDK-Node) to create and send emails automatically.
- Uploading and importing email lists to Marketing Cloud automatically [may be possible with Enhanced FTP.](http://www.degdigital.com/insights/exacttarget-training-automate-importing/). What about uploading images?