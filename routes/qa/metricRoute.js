var express = require('express')
var router = express.Router()
require('dotenv').config();


const cors = require('cors');
const fs = require('fs');

const Runner = require('../../tests/metric-converter/metric-test-runner.js');

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

    // function runTests() {
    //     console.log('Running Tests...');
    //     setTimeout(function () {
    //         try {
    //           let runner = new Runner();
    //           runner.run();
    //           console.log(runner.log());
    //         } catch(e) {
    //             console.log('Tests are not valid:');
    //             console.error(e);
    //         }
    //       }, 1500);
    // }

    // runTests();
  });

router.get('/test', async (req, res) => {
  let journal = "";
  function runTests() {
    console.log('Running Tests...');
    setTimeout(async function () {
        try {
          let runner = new Runner();
          await runner.run();
          journal = runner.log();
          res.send(journal);
        } catch(e) {
            console.log('Tests are not valid:');
            console.error(e);
            res.send(e);
        }
      }, 3500);
    }
  runTests();
});

const expect = require('chai').expect;
const ConvertHandler = require('../../controllers/metric-converter/convertHandler.js');

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

  router.get('/_api/get-tests', cors(), function(req, res, next){
    console.log('requested');
    if(process.env.NODE_ENV_METRIC === 'TEST') return next();
    res.json({status: 'unavailable'});
  },
  function(req, res, next){
    if(!runner.report) return next();
    res.json(testFilter(runner.report, req.query.type, req.query.n));
  },
  function(req, res){
    runner.on('done', function(report){
      process.nextTick(() =>  res.json(testFilter(runner.report, req.query.type, req.query.n)));
    });
  });
  router.get('/_api/app-info', function(req, res) {
    let hs = Object.keys(res._headers)
      .filter(h => !h.match(/^access-control-\w+/));
    let hObj = {};
    hs.forEach(h => {hObj[h] = res._headers[h]});
    delete res._headers['strict-transport-security'];
    res.json({headers: hObj});
  });

function testFilter(tests, type, n) {
  let out;
  switch (type) {
    case 'unit' :
      out = tests.filter(t => t.context.match('Unit Tests'));
      break;
    case 'functional':
      out = tests.filter(t => t.context.match('Functional Tests') && !t.title.match('#example'));
      break;
    default:
      out = tests;
  }
  if(n !== undefined) {
    return out[n] || out;
  }
  return out;
}

module.exports = router