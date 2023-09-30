'use strict'

const express = require('express')
const router = express.Router({caseSensitive: true})

router.get('/', (req, res, next) => {
    console.log('%s %s %s', req.method, req.url, req.path);
    res.locals.title = "HTML and CSS";
    res.send('HTML and CSS');
});

// using the :name parameter in the url to get the file name
// this route serves all HTML and CSS files.
router.get('/:name', (req, res, next) => {
  console.log('%s %s %s', req.method, req.url, req.path)
  var options = {
    root: "public/html/htmlandcss/",
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }
  let filename = req.params.name + ".html";
  res.sendFile(filename , options, function (err) {
    if(err) {
        console.log(err);
        res.status(403).send("Sorry but you shouldn't be here...");
    }
    else {
        console.log('Sent:', filename);
    }
  });
})

module.exports = router