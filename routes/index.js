'use strict'

const express = require('express')
const router = express.Router({caseSensitive: true})

// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.get('/', (req, res, next) => {
  console.log('%s %s %s', req.method, req.url, req.path)
  res.redirect('/welcome');
  next()
})

// this will only be invoked if the path starts with /bar from the mount point (/foo)
router.get('/welcome', function (req, res) {
  // ... maybe some additional /bar logging ...
  console.log('%s %s %s', req.method, req.url, req.path)
  res.locals.title = "Valentin's Portfolio";
  var options = {
    root: "public/html/",
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }
  let filename = "welcome.html";
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
})

module.exports = router