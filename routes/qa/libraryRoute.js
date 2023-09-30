'use strict'

var express = require('express')
var router = express.Router()
require('dotenv').config();

const mongoose = require('mongoose');
const conn = require('../../connections/con_library');

const bookSchema = require('../../schemas/qa/book')
const commentSchema = require('../../schemas/qa/comment')

const Book = conn.model('Book', bookSchema)
const Comment = conn.model('Comment', commentSchema)

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
      let filename = "library.html";
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
  const Mocha = require('mocha'),
  fs = require('fs'),
  path = require('path');

  let mocha = new Mocha({
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: './public/mochawesome-reports',
      reportFilename: 'mochawesome-library',
      reportTitle: 'Library Tests',
      reportPageTitle: 'Library Tests',
      charts: true
    }
  });
  
  // Only run the tests to generate a html/css/js report.
  // mocha.addFile('./public/tests/library/functional_test.js');

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
    let filename = "mochawesome-library.html";
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

router.get('/api/books', async (req, res) => {
        //response will be array of book objects
        //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
        try {
        let arrayOfBooks = await Book.find({});
        res.json(arrayOfBooks);
        } catch (e) {
        console.error(e);
        res.redirect("/");
        }
    })

router.post('/api/books', async (req, res) => {
        let title = req.body.title;

        if(!title) {
        return res.send("missing required field title")
        }

        try {
        let newBook = new Book({
            title: title
        }) 
        let saveBook = await newBook.save();
        let retrievedBook = await Book.findById(saveBook._id);
        let commentPage = await new Comment({book: saveBook._id}).save();
        res.json(retrievedBook);
        } catch (e) {
        console.error(e);
        res.redirect("/");
        }
        //response will contain new book object including atleast _id and title
})

router.delete('/api/books', async (req, res) => {
        //if successful response will be 'complete delete successful'
        const regEx = /.*/
        try {
        let deleteAction = await Book.deleteMany({title: regEx}); 
        res.send("complete delete successful")
        } catch (e) {
        console.error(e);
        res.redirect("/"); 
        }
    });



router.get('/api/books/:id', async (req, res) => {
        let bookid = req.params.id;
        // console.log(req.url)
        console.log(req.query)
        console.log(req.params)
        // if(bookid !== typeof mongoose.Types.ObjectId) return res.send("no book exists")
        //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
        try {
        let com = await Comment.findOne({book: bookid});
        let book = await Book.findById(bookid);

        if(!book) {
            return res.send("no book exists") 
        }

        let commentArray = com.comment.length > 0 ? com.comment : []

        let obj = {
            _id: book._id,
            title: book.title,
            comments: commentArray
        }

        return res.json(obj)

        } catch (e) {
        // console.error(e)
        return res.send("no book exists")
        }
    })

router.post('/api/books/:id', async (req, res) => {
        let bookid = req.params.id;
        let comment = req.body.comment;
        //json res format same as .get

        //if we post with an empty comment
        if(!comment) {
        return res.send("missing required field comment")
        }

        try {
        let com = await Comment.findOne({book: bookid});
        let book = await Book.findById(bookid);

        if(!book) {
            return res.send("no book exists")
        }

        com.comment.push(comment);
        book.commentcount++;
        let savedcom = await com.save();
        let savebook = await book.save();

        let obj = {
            _id: book._id,
            title: book.title,
            commentcount: book.commentcount,
            comments: com.comment
        }

        return res.json(obj)

        } catch (e) {
        console.error(e);
        res.redirect("/"); 
        }
    })

router.delete('/api/books', async (req, res) => {
        let bookid = req.params.id;
        try {
            let deleteResult = await Book.deleteOne({_id: bookid})
            if(deleteResult.deletedCount > 0) {
            return res.send("delete successful")
            }
            else {
            return res.send("no book exists")
            }
        } catch (e) {
            console.error(e);
            res.redirect("/");
        }
        //if successful response will be 'delete successful'
});

module.exports = router;