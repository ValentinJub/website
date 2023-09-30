'use strict';

const userSchema = require("../../schemas/is/user.js");
const crypto = require("crypto");
const express = require('express')
const router = express.Router({caseSensitive: true})
const fetch = require("node-fetch");

const conn = require("../../connections/con_stock.js");
const User = conn.model("User", userSchema);

// http://expressjs.com/en/starter/basic-routing.html
router.get("/", function (req, res) {
    var options = {
        root: "public/html/is/",
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
      }
      let filename = "stock.html";
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

router.get('/api/stock-prices', async function (req, res) {
  try {
    let { stock, like } = req.query;
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip);

    if (Array.isArray(stock)) {
      // Code for comparing two stocks
      let [stock1, stock2] = stock;
      const data1 = await fetchStockData(stock1);
      const data2 = await fetchStockData(stock2);
      await handleUser(ip);
      const likes1 = await handleLike(like, stock1, ip);
      const likes2 = await handleLike(like, stock2, ip);
      res.send({
        "stockData": [
          {
            stock: data1.symbol,
            price: data1.latestPrice,
            rel_likes: likes1 - likes2
          },
          {
            stock: data2.symbol,
            price: data2.latestPrice,
            rel_likes: likes2 - likes1
          }
        ]
      });
    } else {
      const data = await fetchStockData(stock);
      //check if user exists
      await handleUser(ip);
      const likes = await handleLike(like, stock, ip);
      // console.log("number of likes: ", likes)
      // console.log(data);
      res.send({
        "stockData": {
          stock: data.symbol,
          price: data.latestPrice,
          likes: likes
        }
      });
    }
    console.log(stock, like);
  } catch (err) {
    console.log(err);
  }
});

router.get('/test', async (req, res) => {
    const Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');
  
    let mocha = new Mocha({
      reporter: 'mochawesome',
      reporterOptions: {
        reportDir: './public/mochawesome-reports/',
        reportFilename: 'mochawesome-stock',
        reportTitle: 'Stock Price Checker Tests',
        reportPageTitle: 'Stock Price Checker Tests',
        charts: true
      }
    });
    
    
    
    // Only run the tests to generate a html/css/js report.
    // mocha.addFile('./public/tests/stock/functional_tests.js');
  
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
      let filename = "mochawesome-stock.html";
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

async function handleLike(like, stock, ip) {
  if(like === "true") {
    await addLike(ip, stock)
  }
  return await countLikes(stock);
}

async function handleUser(ip) {
  let hash = hashIP(ip);
  let user = await findUser(hash);
  if(!user) {
    user = await createUser(hash);
  }
}

// can i replace the fetch with something else?

async function fetchStockData(stock) {
  return new Promise((resolve, reject) => {
    fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`).then(
      response => resolve(response.json()),
      err => reject(err)
    );
  });
}

function countLikes(stock) {
  return new Promise((resolve, reject) => {
    User.find({ likes: stock }).then(
      data => resolve(data.length),
      err => reject(err)
    );
  });
}

function findUser(ip) {
  let hash = hashIP(ip); 
  return new Promise((resolve, reject) => {
    User.findOne({username: hash}).then(
      data => resolve(data),
      err => reject(err)
    );
  });
}

function createUser(ip) {
  let hash = hashIP(ip); 
  return new Promise((resolve, reject) => {
    let user = new User({username: hash});
    user.save().then(
      data => resolve(data),
      err => reject(err)
    )
  });
}

async function addLike(ip, stock) {
  let hash = hashIP(ip); 
  try {
    let user = await findUser(hash);
    if(user.likes.indexOf(stock) === -1) {
      user.likes.push(stock);
      await user.save();
    }
  }
  catch(err) {
    console.log(err);
  } 
}

function hashIP(ip) {
  return crypto.createHash("md5").update(ip).digest("hex"); 
}

module.exports = router;