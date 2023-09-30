var express = require('express')
var router = express.Router()

require('dotenv').config();
const mongoose = require('mongoose');

const conn = require('../../connections/con_exercise_tracker');
const userSchema = require('../../schemas/backend/users')

const User = conn.model('Users', userSchema)

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
    let filename = "exercise-tracker.html";
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

var exerciseSchema = require('../../schemas/backend/exercises')


router.post('/api/users', function(req, res) {
  let username = req.body.username;
  User.findOne({username}, (err, match) => {
    if(match) {
      let {_id} = match;
      return res.json({
        username,
        _id
      });
    }
    User.create({username}, (err, newUser) => {
    let {_id} = newUser;
      return res.json({
        username,
        _id
      });
    })
  })
});

router.get('/api/users', function(req, res) {
  User.find({}, (err, users) => {
    const filteredUsers = users.map((value) => {
      let {username, _id} = value
      return {
        username,
        _id
      };
    });
    res.json(filteredUsers);
  })
});

router.post('/api/users/:_id/exercises', (req, res) => {
  User.findById(req.params._id, (err, match) => {
    let date = req.body.date;
    let {description, duration} = req.body;

    if (date == '') {
      date = new Date().toDateString();
    } else {
      date = new Date(date).toDateString();
      if(date === "Invalid Date") {
        date = new Date().toDateString();
      }
    }
    match.log.push({description, duration, date});
    match.save((err, user) => {
      let {username, _id} = user;
      res.json({
        username,
        description,
        duration: parseInt(duration),
        date,
        _id
      });
    });
  })
});

router.get('/api/users/:_id/logs', (req, res) => {
  const { from, to, limit } = req.query;
  console.log(req.query)
  console.log(req.url)  

  User.findById(req.params._id, (err, match) => {
    let log = [];
    let loopLimit = limit === undefined ? match.log.length : limit;
    for(let i = 0; i < match.log.length; i++ ) {
      let doNotPush = false; 
      let value = match.log[i];
      let {description, duration, date} = value;
      
      if(JSON.stringify(req.query) !== '{}') {
        
        let dateDate = new Date(date);
        let fromDate = new Date(from);
        let toDate = new Date(to);

        if(from !== undefined) {         
          //we do not include before from date
          if(fromDate > dateDate) doNotPush = true;
        }

        if(to !== undefined) {
          //we do not include after to date
          if(toDate < dateDate) doNotPush = true;
        }
      }

      if(!doNotPush) {
        log.push({
          description,
          duration,
          date
        });
        if(log.length === parseInt(limit)) {
          i = match.log.length
        }
      }
    }
    let {username, _id} = match;
    res.json({
      username,
      count: log.length,
      _id,
      log
    });
  })
});

module.exports = router