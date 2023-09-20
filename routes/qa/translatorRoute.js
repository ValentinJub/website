'use strict'

var express = require('express')
var router = express.Router()

const Translator = require('../../components/translator.js');

//Index page (static HTML)
router.get('/', function (req, res) {
    var options = {
        root: "public/html/qa/",
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
      }
      let filename = "translator.html";
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

router.get('/test', (req, res) => {
    const Mocha = require('mocha');
  
    let mocha = new Mocha({
      reporter: 'mochawesome',
      reporterOptions: {
        reportDir: './public/mochawesome-reports',
        reportFilename: 'mochawesome-translator',
        reportTitle: 'Translator Tests',
        reportPageTitle: 'Translator Tests',
        charts: true
      }
    });
    
    // Only run the tests to generate a html/css/js report.
    // mocha.addFile('./public/tests/translator/functional-tests.js');
    // mocha.addFile('./public/tests/translator/unit-tests.js');
  
    try {
      // Run the tests.
    //   mocha.ui('bdd').run();
      var options = {
        root: "public/mochawesome-reports/",
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true,
          'Content-Type': 'text/html'
        }
      }
      let filename = "mochawesome-translator.html";
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

router.post('/api/translate', (req, res) => {
    const localeArray = [
    "british-to-american",
    "american-to-british"
    ]
    const text = req.body.text;
    const locale = req.body.locale;

    if(text === undefined || !locale) {
        return res.send({error: 'Required field(s) missing'})
    }
    else if(text === "") {
        return res.send({error: "No text to translate"})
    }
    else if(localeArray.indexOf(locale) === -1) {
        return res.send({error: "Invalid value for locale field"})
    }
    else {
        const translator = new Translator(text, locale);      
        const result = translator.translate();
        if(result.translation === text) {
            // console.log(`${locale}\nSource\n${text}\nResult\nEverything looks good to me!\n`);
            return res.send({
            text: text,
            translation: "Everything looks good to me!"
            })
        }
        // console.log(`${locale}\nSource\n${text}\nResult\n${result.translation}\n`);
        return res.send({
            text: text,
            translation: result.translation
        })
    }
});


module.exports = router;