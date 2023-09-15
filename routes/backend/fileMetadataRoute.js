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
      let filename = "file-metadata.html";
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

router.post('/api/fileanalyse', async (req, res) => {
    try {
      if(!req.files) {
        res.send({
          status: false,
          message: 'No file uploaded'
        });
      } else {
        //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
        let file = req.files.upfile;
  
        //Use the mv() method to place the file in the upload directory (i.e. "uploads")
        file.mv('../../uploads/' + file.name);
  
        //send response
        res.json({
            name: file.name,
            type: file.mimetype,
            size: file.size
        })
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

module.exports = router