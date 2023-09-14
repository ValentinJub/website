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
      let filename = "timestamp.html";
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

router.get("/api/:date?", (req, res) => {
  const unixRegex = /^[0-9]+$/;
  let dateEntered = req.params.date;
  let dateGMT, dateUNIX;
  //if no params provided
  if(dateEntered === undefined) {
    //fetch date now
    dateGMT = Date();
    dateGMT = new Date(dateGMT).toUTCString();
    //translate to unix
    dateUNIX = Date.parse(dateGMT);
    res.json({unix: dateUNIX, utc: dateGMT})
  }
  else {
    if(unixRegex.test(dateEntered)) {
       //fetch date now
       dateGMT = new Date(parseInt(dateEntered)).toUTCString();
       //translate to unix
       dateUNIX = Date.parse(dateGMT);
       res.json({unix: dateUNIX, utc: dateGMT})
    }
    else if(new Date(dateEntered) == "Invalid Date") {
      res.json({error: "Invalid Date"});
    }
    else {
      //fetch date now
      dateGMT = new Date(dateEntered).toUTCString();
      //translate to unix
      dateUNIX = Date.parse(dateGMT);
      res.json({unix: dateUNIX, utc: dateGMT})
    }
  }
});

  module.exports = router
