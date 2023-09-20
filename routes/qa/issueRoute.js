'use strict'

var express = require('express')
var router = express.Router()
require('dotenv').config();

const mongoose = require('mongoose');

/* See: https://mongoosejs.com/docs/connections.html#multiple_connections */

const conn = require('../../connections/con_issue');

const issueSchema = require('../../models/qa/issue')
const Issue = conn.model('Issue', issueSchema)


router.get('/', async (req, res) => {
    logger(req);
    let issues;
    try {
      issues = await Issue.find().limit(2).exec();
      console.log(issues)
      res.render('issue_tracker/index', {
        issues: issues,
        layout: 'layouts/issue_tracker'
      });
    } catch (err) {
      issues = [];
      console.error(err)
      res.render('issue_tracker/index', {
        issues: [],
        errorMessage: err,
        layout: 'layouts/issue_tracker'
      })
    }
  })
  
function logger(req) {
    console.log('%s %s %s', req.method, req.url, req.path);
}

function queryParser(query, fields, obj = {}) {
    fields.forEach((e) => {
      if(query[e]) {
        obj[e] = query[e];
      }
    })
    return obj;
  }
  
router.get('/api/issues/:project', async (req, res) => {
    let fields = ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open', 'created_on', 'updated_on'];
    let query = queryParser(req.query,fields);
    //we do query.project so we can also query mongoose against project name
    query.project = req.params.project;
    //You can send a GET request to /api/issues/{projectname}
    //for an array of all issues for that specific projectname,
    // with all the fields present for each issue.

    if(req.query._id){
        query._id=mongoose.Types.ObjectId(req.query._id);
    }
    try {
        let R = await Issue.find(query)
        res.json(R)
    } catch(e) {
        console.error("Error caught while finding Issues, details below:")
        console.error(e)
        return res.send(err)
    }
})

router.post('/api/issues/:project', async (req, res) => {
    // logger(req)
    let project = req.params.project;
    let {issue_title, issue_text, created_by, assigned_to, status_text} = req.body;

    //if one of the required field is empty string or undefined
    if(issue_title === '' || issue_title === undefined || issue_text === '' || issue_text === undefined || created_by === '' || created_by === undefined) {
        return res.send({error: 'required field(s) missing'})
    }

    let newIssue = new Issue({
        project: project,
        issue_title: issue_title,
        issue_text: issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: created_by,
        assigned_to: assigned_to,
        status_text: status_text
    })

    try {
        let R = await newIssue.save();
        // console.log("the issue sent in the POST request is the below: ")
        // console.log(R)
        return res.send(R)
    }
    catch(e) {
        console.error(e)
        return res.send({errror: "database logical error"})
    }
})

router.get('/test', (req, res) => {
    const Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');
  
    let mocha = new Mocha({
      reporter: 'mochawesome',
      reporterOptions: {
        reportDir: './public/mochawesome-reports/',
        reportFilename: 'mochawesome-issue',
        reportTitle: 'Issue Tracker Tests',
        reportPageTitle: 'Issue Tracker Tests',
        charts: true
      }
    });
    
    
    
    // Only run the tests to generate a html/css/js report.
    // mocha.addFile('./public/tests/issue/functional-tests.js');
  
    try {
      // Run the tests.
        // mocha.ui('bdd').run();
      var options = {
        root: "public/mochawesome-reports/",
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true,
          'Content-Type': 'text/html'
        }
      }
      let filename = "mochawesome-issue.html";
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

router.put('/api/issues/:project', async (req, res) => {
    // logger(req)
    let fields = ["_id", 'issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text'];
    let query = queryParser(req.body, fields)

    if(!query._id) {
        return res.send({
        error: 'missing _id'
        });
    } 

    if(Object.keys(query).length < 2) {
        return res.send({
        error: 'no update field(s) sent',
        _id: query._id
        })
    }

    try {
        let issue = await Issue.findOne({_id: query._id});
        // (e) => { console.error(e) ; return res.send({error:'could not update', _id:query._id})},
        
        // delete query._id;
        
        if(issue) {
        Object.keys(query).forEach(key=>{
            issue[key]=query[key];
            issue.markModified('key');
        })
        issue.updated_on = new Date();

        let updatedIssue = await issue.save();
        return res.send({
            result: 'successfully updated', 
            '_id': updatedIssue._id
        })
        }
        else {
        return res.send({
            error: 'could not update', 
            _id: query._id
        })
        }
    } 
    catch(e) {
        console.error(e); 
        return res.send({
        error: 'could not update', 
        _id: query._id
        })
    } 
});

router.delete('/api/issues/:project', async (req, res) => {
    // logger(req);

    //check we have an _id
    if(!req.body._id) {
        return res.send({error: 'missing _id'})
    }

    let _id = req.body._id;
    // console.log(_id)

    //we want to make sure we search with a mongoose objectID
    //we need to be aware that inputting a valid objectID WILL NOT result in an error
    if(mongoose.Types.ObjectId.isValid(_id)) {
        await Issue.deleteOne({_id: _id}, (err, result) => {
        //we manage the error here
        if(err) {
            console.error(err);
            return res.send({
            error: 'could not delete',
            '_id': _id
            })
        }
        // console.log(result)
        //we make sure we actually deleted something
        if(result.deletedCount > 0) {
            return res.send({
            result: 'successfully deleted',
            '_id': _id
            })
        }
        //if we didn't delete anything 
        else {
            return res.send({
            error: 'could not delete',
            '_id': _id
            })
        }
        })
    }
    //if the id passed IS NOT a valid mongoose ObjectID
    else {
        return res.send({
        error: 'could not delete',
        '_id': _id
        })
    }
})


module.exports = router;