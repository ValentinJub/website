var express = require('express')
var router = express.Router()
require('dotenv').config();
const fs = require('fs');

// http://expressjs.com/en/starter/basic-routing.html
router.get("/", function (req, res) {
    var options = {
        root: "public/html/qa/",
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
      }
      let filename = "metric-converter.html";
      let hostname = req.hostname;
      let port = 3000;
      let fqdn = hostname + ":" + port;
    res.sendFile(filename , options, function (err) {
        if(err) {
            console.log(err);
            res.status(403).send("Sorry but you shouldn't be here...");
        }
        else {
            console.log('Sent:', filename);
       }
    });
  });

// router.get('/unittest', (req, res) => {
//   // function runTests() {
//   //   console.log('Running Tests...');
//   //   setTimeout(async function () {
//   //       try {
//   //         let runner = new Runner();
//   //         runner.run();
//   //         res.send('Success!');
//   //       } catch(e) {
//   //           console.log('Tests are not valid:');
//   //           console.error(e);
//   //           res.send(e);
//   //       }
//   //     }, 3500);
//   //   }
//   // runTests();
//     var options = {
//       root: "public/html/qa/",
//       dotfiles: 'deny',
//       headers: {
//         'x-timestamp': Date.now(),
//         'x-sent': true
//       }
//     }
//     let filename = "metric-mocha.html";
//     let hostname = req.hostname;
//     let port = 3000;
//     let fqdn = hostname + ":" + port;
//     res.sendFile(filename , options, function (err) {
//       if(err) {
//           console.log(err);
//           res.status(403).send("Sorry but you shouldn't be here...");
//       }
//       else {
//           console.log('Sent:', filename);
//       }
//     });
// });

// Create a route to prevent issue with serving a JS file from the public folder
// Sometime Express will send the file as text/html instead of text/javascript

router.get('/assets/:filename', (req, res) => {
  const filename = req.params.filename;
  const type = filename.split('.')[1];
  let content_type = '';  
  if(type === 'js') content_type = 'text/javascript';
  else if(type === 'css') content_type = 'text/css';
  else if(type === 'png') content_type = 'image/png';
  else if(type === 'svg') content_type = 'image/svg+xml';
  else if(type === 'ico') content_type = 'image/x-icon';
  else if(type === 'json') content_type = 'application/json';
  else content_type = 'text/html';

  var options = {
    root: "public/mochawesome-reports/assets/",
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true,
        'Content-Type': content_type
    }
  }
  res.sendFile(filename, options, function (err) {
    if(err) {
        console.log(err);
        res.status(403).send("Sorry but you shouldn't be here...");
    }
    else {
        console.log('Sent:', filename);
    }
  });
});

// Route to serve the mochawesome report

router.get('/test', (req, res) => {
  // const Mocha = require('mocha');

  // let mocha = new Mocha({
  //   reporter: 'mochawesome',
  //   reporterOptions: {
  //     reportDir: './public/mochawesome-reports/metric',
  //     reportFilename: 'mochawesome-metric',
  //     reportTitle: 'Metric Converter Tests',
  //     reportPageTitle: 'Metric Converter Tests',
  //     charts: true
  //   }
  // });
  
  let testDir = './public/tests/metric-converter';
  
  // Only run the tests to generate a html/css/js report.
    // mocha.addFile(path.join(testDir, 'functional-test.js'));
    // mocha.addFile(path.join(testDir, 'unit-tests.js'));

  try {
    // Run the tests.
      // mocha.ui('bdd').run();
    var options = {
      root: "public/mochawesome-reports/",
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true,
        'Content-Type': 'text/html'
      }
    }
    let filename = "mochawesome-metric.html";
    let hostname = req.hostname;
    let port = 3000;
    let fqdn = hostname + ":" + port;
    res.sendFile(filename , options, function (err) {
      if(err) {
          console.log(err);
          res.status(403).send("Sorry but you shouldn't be here...");
      }
      else {
          console.log('Sent:', filename);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

const ConvertHandler = require('../../public/controllers/metric-converter/convertHandler.js');

let convertHandler = new ConvertHandler();

router.get('/api/convert', (req, res) => {
    // console.log(req.query)
    // console.log(req.url)
    let num = convertHandler.getNum(req.query.input)
    let unit = convertHandler.getUnit(req.query.input)
    let returnNum = convertHandler.convert(num, unit)
    let returnUnit = convertHandler.getReturnUnit(unit)
    let string = convertHandler.getString(num, unit, returnNum, returnUnit)
    let obj = {
    initNum: num,
    initUnit: unit,
    returnNum: returnNum,
    returnUnit: returnUnit,
    string: string
    };
    let invalidResponse = 'invalid number and unit';
    // console.log(obj)
    if(num === "invalid number" && unit === "invalid unit") res.send(invalidResponse)
    else if(num === "invalid number") res.send(num)
    else if(unit === "invalid unit") res.send(unit)
    else res.send(obj)
});

module.exports = router