'use strict'

const express = require('express')
const router = express.Router({caseSensitive: true})

// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.get('/barchart_v1', (req, res, next) => {
  console.log('%s %s %s', req.method, req.url, req.path)
  res.render('d3/barchart_v1');
  next()
})

router.get('/barchart_v2', (req, res, next) => {
  console.log('%s %s %s', req.method, req.url, req.path)
  res.render('d3/barchart_v2');
  next()
})

module.exports = router