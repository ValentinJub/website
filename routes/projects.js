'use strict'

const express = require('express')
const router = express.Router({caseSensitive: true})

// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.get('/', (req, res, next) => {
  console.log('%s %s %s', req.method, req.url, req.path)
  res.render('index');
  next()
})

// // always invoked
// router.use(function (req, res, next) {
  
// })

module.exports = router