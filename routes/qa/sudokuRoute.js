'use strict'

var express = require('express')
var router = express.Router()
const SudokuSolver = require('../../public/controllers/sudoku/sudoku-solver.js');

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
      let filename = "sudoku.html";
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
    const Mocha = require('mocha');
  
    let mocha = new Mocha({
      reporter: 'mochawesome',
      reporterOptions: {
        reportDir: './public/mochawesome-reports',
        reportFilename: 'mochawesome-sudoku',
        reportTitle: 'Sudoku Tests',
        reportPageTitle: 'Sudoku Tests',
        charts: true
      }
    });
    
    // Only run the tests to generate a html/css/js report.
    // mocha.addFile('./public/tests/sudoku/functional-tests.js');
    // mocha.addFile('./public/tests/sudoku/unit-tests.js');
  
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
      let filename = "mochawesome-sudoku.html";
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

router.post('/api/check', (req, res) => {
    const { puzzle: puzzle, coordinate: coordinate, value: value } = req.body;
    console.log(`The puzzle string is: ${puzzle}`)
    console.log(`The coordinate are: ${coordinate}`)
    console.log(`The value is: ${value}`)

    if(!puzzle || !coordinate || !value) return res.send({error: 'Required field(s) missing'})

    let solver = new SudokuSolver(puzzle);

    const isValid = solver.validatePuzzleLengthAndInputs(puzzle)
    //If the puzzle submitted to /api/solve contains values which are not numbers or periods, the returned value will be { error: 'Invalid characters in puzzle' }
    if(isValid === "Invalid characters in puzzle") {
        return res.send({error: 'Invalid characters in puzzle'})
    }
    //If the puzzle submitted to /api/solve is greater or less than 81 characters, the returned value will be { error: 'Expected puzzle to be 81 characters long' }
    else if(isValid === "Expected puzzle to be 81 characters long") {
        return res.send({error: "Expected puzzle to be 81 characters long"})
    }
    //If the puzzle submitted to /api/solve is invalid or cannot be solved, the returned value will be { error: 'Puzzle cannot be solved' }
    else if(isValid === "Puzzle cannot be solved") {
        return res.send({error: "Puzzle cannot be solved"})
    }

    const valueIsCorrect = solver.numberValidator(value);
    const coordinateIsCorrect = solver.rowValidator(coordinate)

    if(!coordinateIsCorrect) {
        return res.send({error: 'Invalid coordinate'})
    }
    else if(!valueIsCorrect) {
        return res.send({error: 'Invalid value'})
    }
    else {
        //check if the input value is already in the puzzle
        if(solver.alreadyInTheGrid(coordinate, value)) {
            return res.send({valid: true})
        }
        else {
            const check = solver.checkPlacement(coordinate, value)
            return res.send(check);
        }
    }

});

router.post('/api/solve', (req, res) => {
    let puzzle = req.body.puzzle
    //If the object submitted to /api/solve is missing puzzle, the returned value will be { error: 'Required field missing' }
    if(!puzzle) {
        return res.send({error: 'Required field missing'})
    }
    
    let solver = new SudokuSolver(puzzle);
    solver.testing(puzzle)
    const isValid = solver.validatePuzzleLengthAndInputs(puzzle)
    //If the puzzle submitted to /api/solve contains values which are not numbers or periods, the returned value will be { error: 'Invalid characters in puzzle' }
    
    if(isValid === "Invalid characters in puzzle") {
        return res.send({error: 'Invalid characters in puzzle'})
    }
    //If the puzzle submitted to /api/solve is greater or less than 81 characters, the returned value will be { error: 'Expected puzzle to be 81 characters long' }
    else if(isValid === "Expected puzzle to be 81 characters long") {
        return res.send({error: "Expected puzzle to be 81 characters long"})
    }
    //If the puzzle submitted to /api/solve is invalid or cannot be solved, the returned value will be { error: 'Puzzle cannot be solved' }
    else if(isValid === "Puzzle cannot be solved") {
        return res.send({error: "Puzzle cannot be solved"})
    }
    else if(isValid) {
        let result = solver.solve(puzzle)
        if(result.solved) {
            return res.send({solution: result.solution, solved: true})
        }
        else {
            return res.send({error: "Puzzle cannot be solved", solved: false})
        }
    }
});

module.exports = router;