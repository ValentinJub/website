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
      let filename = "weather-api.html";
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

module.exports = router