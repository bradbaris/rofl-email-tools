# Chaminade Email Newsletter Templates
[![UCM](https://img.shields.io/badge/Department-UCM-blue.svg)](https://www.chaminade.edu)  

A little inhouse email templating workflow based on [MJML](https://mjml.io/), [Handlebars](http://handlebarsjs.com/), and [Gulp](http://gulpjs.com/). Uses [Nodemailer](https://nodemailer.com/) for fast test emails. The templates already come with the necessary [AMPscript](https://help.marketingcloud.com/en/documentation/ampscript/ampscript_syntax_guide/) template strings for Salesforce Marketing Cloud. This was made and tested (although no test suite) to work on Mac OSX.

Just have to fill out `src/emailconfig.json` with email content, then select the appropriate template from `/templates` and feed it into gulp as parameters, for example: 
  ```
  gulp --data src/emailconfig.json --template templates/newsletter_master.hbs
  ```

## Gulp Task Overview:

### Compile Email  
The `--data` and `--template` parameters are _REQUIRED_.

_Read first: If you change the `template.constituency` in `emailconfig.json`, you should run it twice to ensure all fields properly changed. Also `template.nameplate_image` and `template.masthead` will be overwritten, as `template.constituency` generates it._  

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
_Read first: Before you do this, you have to upload the images to Salesforce Marketing Cloud and use those CDN URIs for all image assets. The test email also does not fill in the `%%template%%` AMPscript tags. It is merely for layout and copy proofing._  

Sends out a test email via GMail via nodemailer. Asks you for your GMail credentials (not saved), email recipient, and template. Requires an env variable `$TEST_EMAIL_LIST` in the format `"email@address.edu,email@address.edu,[...]"` since Bash can't export arrays as env variables. Optional `$CHAMINADE_EMAIL` and `$CHAMINADE_PW` to autofill email credentials.
  ```
  gulp sendTestEmail
  ```

### Pull a fresh email list (for Faculty/Staff/Adjuncts)
Pulls an email list. This relies on a few env variables: `$CUH_EMAIL_ENDPOINT` for the CUH API URI for internal emails, and `$CUH_EMAIL_OAUTH` for the OAUTH token.
  ```
  gulp getEmails
  ```

## What Gulp doesn't do
- Right now, basically anything to do with Salesforce. It just builds out the HTML email itself.
  - Does not upload your images into Salesforce Marketing Cloud.
  - Does not create your emails in Salesforce Marketing Cloud either.
  - One currently has to clone a previous email in Salesforce (faster than from scratch), manually edit the email's Salesforce filename and the email subject, and use the GUI to formally send the email out. We pretty much use Salesforce only for the Sender Authentication Package (and maybe fancy segmenting and dynamic content with AMPscript in the future).

## Features currently exploring
- May be possible to connect to Salesforce Marketing Cloud via their [FUEL SDK for Node](https://github.com/salesforce-marketingcloud/FuelSDK-Node) to create and send emails automatically.
- Salesforce [AMPscript](https://help.marketingcloud.com/en/documentation/ampscript/ampscript_syntax_guide/) logic and integration features. Social Forwarding?
- Uploading and importing email lists to Salesforce Marketing Cloud automatically [may be possible with Enhanced FTP](http://www.degdigital.com/insights/exacttarget-training-automate-importing/). What about uploading images?