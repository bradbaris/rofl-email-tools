'use strict';

const fs       = require('fs'),
      path     = require('path'),
      request  = require('request'),
      requestp = require('request-promise'),
      libxmljs = require('libxmljs'),
      Litmus   = require('./litmus-api'),
      progress = require('request-progress'),
      sleep    = require('child_process').execSync;

  var options = {
      url: "",
      body: "",
      method: "",
      headers: "",
      auth: {
        "user": process.env.LITMUS_EMAIL,
        "pass": process.env.LITMUS_PW
      },
      base: "https://richardsevilla.litmus.com"
    };

  var testSet    = "",
      emailTests = "",
      imageList  = [];
  
  var litmusApi = new Litmus(options);
  var emailBody = fs.readFileSync(config.paths.lib + '/litmus/data.xml', 'utf-8');

/**
 * Litmus Test Cycle
 *
 * Asks Litmus for a list of testing clients, bundles a built email
 * into an XML request, sends it to Litmus, then polls until all tests are completed.
 * Finally, it downloads all test results into `litmus_test` folder.
 **/
module.exports = function(emailData, filename) {

  if(!process.env.LITMUS_EMAIL || typeof process.env.LITMUS_EMAIL === "undefined" || process.env.LITMUS_EMAIL == "") {
    throw new Error('$LITMUS_EMAIL is required!');
  }
  if(!process.env.LITMUS_PW || typeof process.env.LITMUS_PW === "undefined" || process.env.LITMUS_PW == "") {
    throw new Error('$LITMUS_PW is required!');
  }

  console.log("Initiating Litmus Test cycle.");
  litmusApi.getEmailClients()
    .then(function(response) {
      console.log("(1/5) • Retrieving Email Test Clients...");
      let xml = libxmljs.parseXml(response);
      let codes = xml.find("//application_code");
      for(let i = 0; i < codes.length; i++) {
        /* ROFL. Screw parsing XML DOM. Just use raw strings */
        emailTests += "<application><code>"+codes[i].text()+"</code></application>\n    ";
        process.stdout.write("|");
      }
      process.stdout.write(" Count "+codes.length+"\n");
      emailBody = emailBody.replace('{{BODY}}', emailData);
      emailBody = emailBody.replace('{{SUBJ}}', filename);
      emailBody = emailBody.replace('{{APPS}}', emailTests);
  
      litmusApi.createEmailTest(emailBody)
        .then( function(response) {
          let xml = libxmljs.parseXml(response);
          testSet = xml.get('/test_set/id').text();
          console.log("(2/5) • Creating Email Test on Litmus. TEST ID = " + testSet);
          console.log("(3/5) • Waiting 5 minutes for tests to process...");
          for(var t = 0; t < 300; t++) {
            sleep("sleep 1");
            process.stdout.write("|");
          }
          process.stdout.write("\n");

          const version = "1"; // Hardcoded Version 1 for simplicity
          litmusApi.pollVersion(testSet, version)
          .then( function(response) {

            let xml = libxmljs.parseXml(response);
            let resultID = xml.find("//id");
            let testName = xml.find("//test_code");
            let status = xml.find("//state");
            let testManifest = [];

            for(let b = 0; b < resultID.length; b++) {
              let obj = {};
              obj.name = testName[b].text();
              obj.id = resultID[b].text();
              obj.status = status[b].text();
              testManifest.push(obj);
            };

            let check = testManifest.filter(function(item) {
              return item.status != "complete";
            });
            if(check.length == 0) {
              console.log("(3/5) • Testing complete!");
            } else {
              console.log("(3/5) • Some tests not completed. Proceeding anyway.");
              console.log("(3/5) • Full test results are online at https://litmus.com/checklist");
              console.log("\n\n" + JSON.stringify(check, null, '  ') + "\n\n");
            }
          })
          .then(
            litmusApi.getResults(testSet, version)
              .then(function(response) {
                console.log("(4/5) • Retrieving Test Results...");
                let xml4 = libxmljs.parseXml(response);
                let codes4 = xml4.find("//full_image");
                for(let i = 0; i < codes4.length; i++) {
                  imageList.push(codes4[i].text());
                  // console.log(codes[i].text()); // debug
                };

                /* Need to dedupe since Litmus has same URLs for any of
                   index_on, index_off, window_on, window_off */
                imageList = imageList.filter(function (element, index, array) {
                  return array.indexOf(element) === index;
                }).map(function(currentValue) {
                  return currentValue = "http://" + currentValue;
                });

                console.log("(5/5) • Downloading Tests to /litmus_tests/"+testSet+"/");
                imageList.forEach(function(element) {
                  var folder = path.join(config.paths.project, "litmus_tests", testSet);
                  var name = path.basename(element);
                  if (!fs.existsSync(folder)){
                    fs.mkdirSync(folder);
                  }
                  name = path.join(folder, name);
                  progress(request(element), {
                    throttle: 2000,
                    delay: 1000
                  })
                  .on('progress', function (state) {
                    var segment = element.substring(element.lastIndexOf('://')+3,element.indexOf('.'));
                    process.stdout.write("["+segment+" : "+ Math.round(state.percentage * 100)+"%] ");
                  })
                  .on('error', function (err) {
                    console.log('Download Error: ', err);
                  })
                  .pipe(fs.createWriteStream(name));
                });
              })
          );
        });
    });
}
