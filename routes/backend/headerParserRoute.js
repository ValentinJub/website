'use strict'

const express = require('express')
const router = express.Router({caseSensitive: true})


// http://expressjs.com/en/starter/basic-routing.html
router.get("/", function (req, res) {
    var options = {
        root: "public/html/backend/",
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
      }
      let filename = "header-parser.html";
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

router.get("/api/whoami", (req, res) => {
  //the ip is in req.ip methods while the rest of the info we need is in the headers
  let ipRequest = req.ip;
  let browserUsed = req.headers["user-agent"];
  let languageUsed = req.headers["accept-language"];
  res.json({
    ipaddress: ipRequest,
    software: browserUsed,
    language: languageUsed
  })
})

  module.exports = router
