const fs       = require('fs'),
      path     = require('path'),
      request  = require('request'),
      requestp = require('request-promise'),
      libxmljs = require('libxmljs'),
      Litmus   = require('./litmus-api'),
      progress = require('request-progress');

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
      emailTests = "";
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
module.exports = function createTest(emailData, filename) {

  console.log("Initiating Litmus Test cycle.");
  litmusApi.getEmailClients()
    .then(function(response) {
      console.log("(1/5) • Retrieving Email Test Clients...");
      let xml = libxmljs.parseXml(response);
      let codes = xml.find("//application_code");
      for(let i = 0; i < codes.length; i++) {
        /* ROFL. Screw parsing XML DOM. Just use raw strings */
        emailTests += "<application><code>"+codes[i].text()+"</code></application>\n    ";
      }
      emailBody = emailBody.replace('{{BODY}}', emailData);
      emailBody = emailBody.replace('{{SUBJ}}', filename);
      emailBody = emailBody.replace('{{APPS}}', emailTests);
  
      litmusApi.createEmailTest(emailBody)
        .then( function(response) {
          console.log("(2/5) • Creating Email Test on Litmus...");
          let xml = libxmljs.parseXml(response);
          testSet = xml.get('/test_set/id').text();
          const version = "1"; // Hardcoded Version 1 for simplicity

          litmusApi.pollVersion(testSet, version)
          .then( function(response) {
            var flag = false;
            let xml = libxmljs.parseXml(response);
            let codes = xml.find("/result/state");
            var check = codes.filter(function(value) {
              return value != "complete";
            });
            if(check.length == 0) {
              console.log("(3/5) • Checking if Tests have completed...");
            } else {
              console.log("Waiting for Litmus tests to generate...\n"+
                          "Now what? Haven't written a retry function, because\n"+
                          "Litmus servers are quick. You usually don't reach this point.");
            }

            litmusApi.getResults(testSet, version)
              .then(function(response) {
                console.log("(4/5) • Retrieving Test Results...");
                let xml = libxmljs.parseXml(response);
                let codes = xml.find("//full_image");
                for(let i = 0; i < codes.length; i++) {
                  imageList.push(codes[i].text());
                };

                /* Need to dedupe since Litmus has same URLs for any of
                   index_on, index_off, window_on, window_off */
                imageList = imageList.filter(function (element, index, array) {
                  return array.indexOf(element) === index;
                }).map(function(currentValue){
                  return currentValue = "http://" + currentValue;
                });
                console.log("(5/5) • Downloading Tests...");
                imageList.forEach(function(element) {
                  var folder = path.join(config.paths.project, "litmus_tests", testSet);
                  var name = element.substring(element.lastIndexOf('/') + 1);
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
                })
              })
          })
        })
    });
}

