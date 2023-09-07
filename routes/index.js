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
router.get('/welcome', function (req, res, next) {
  // ... maybe some additional /bar logging ...
  console.log('%s %s %s', req.method, req.url, req.path)
  res.locals.title = "Valentin's Portfolio";
  res.render("welcome")
  next()
})

// // always invoked
// router.use(function (req, res, next) {
  
// })

module.exports = router