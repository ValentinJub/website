const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../../../server');

const Puzzle = require('../../controllers/sudoku/puzzle-strings.js');
const SudokuSolver = require('../../controllers/sudoku/sudoku-solver.js');

const puzzleWithBadChar = 'BADCHARACTER3.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37P'
const puzzleWithEightyChar = '.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
const puzzle =   '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
const solution = '568913724342687519197254386685479231219538467734162895926345178473891652851726943'
const unsolvablePuzzle = '6..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
const badSolution = '568913724342687519197254386685479231219538467534162895926345178473891652851726943'

chai.use(chaiHttp);

describe('Functional Tests', () => {
  describe('Routing tests', () => {
    describe('Solve methods', () => {
      it('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
        chai.request(server)
            .post('/projects/qa/sudoku/api/solve')
            .send({
              puzzle: puzzle,
            })
            .end((err,res) => {
              assert.equal(res.status, 200);
              assert.strictEqual(res.body.solved, true);
              assert.strictEqual(res.body.solution, solution);
              done();
            })
      })
      it('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
        chai.request(server)
            .post('/projects/qa/sudoku/api/solve')
            .send({
              nothing: ''
            })
            .end((err,res) => {
              assert.equal(res.status, 200);
              assert.hasAnyKeys(res.body, "error")
              assert.strictEqual(res.body.error, 'Required field missing');
              done();
            })
      })
      it('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
        chai.request(server)
            .post('/projects/qa/sudoku/api/solve')
            .send({
              puzzle: puzzleWithBadChar
            })
            .end((err,res) => {
              assert.equal(res.status, 200);
              assert.hasAnyKeys(res.body, "error")
              assert.strictEqual(res.body.error, 'Invalid characters in puzzle');
              done();
            })
      })
      it('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
        chai.request(server)
            .post('/projects/qa/sudoku/api/solve')
            .send({
              puzzle: puzzleWithEightyChar
            })
            .end((err,res) => {
              assert.equal(res.status, 200);
              assert.hasAnyKeys(res.body, "error")
              assert.strictEqual(res.body.error, 'Expected puzzle to be 81 characters long');
              done();
            })
      })
      it('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
        chai.request(server)
            .post('/projects/qa/sudoku/api/solve')
            .send({
              puzzle: unsolvablePuzzle
            })
            .end((err,res) => {
              assert.equal(res.status, 200);
              assert.hasAnyKeys(res.body, "error")
              assert.strictEqual(res.body.error, 'Puzzle cannot be solved');
              done();
            })
      })
      it('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
        chai.request(server)
            .post('/projects/qa/sudoku/api/solve')
            .send({
              puzzle: unsolvablePuzzle
            })
            .end((err,res) => {
              assert.equal(res.status, 200);
              assert.hasAnyKeys(res.body, "error")
              assert.strictEqual(res.body.error, 'Puzzle cannot be solved');
              done();
            })
      })
    });
    describe('Check methods', () => {
      it('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/projects/qa/sudoku/api/check')
            .send({
              puzzle: puzzle,
              coordinate: 'A2',
              value: '6'
            })
            .end((err,res) => {
              assert.equal(res.status, 200);
              assert.hasAnyKeys(res.body, "valid")
              assert.strictEqual(res.body.valid, true);
              done();
            })
      })
      it('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/projects/qa/sudoku/api/check')
            .send({
              puzzle: puzzle,
              coordinate: 'A2',
              value: '9'
            })
            .end((err,res) => {
              assert.equal(res.status, 200);
              assert.hasAnyKeys(res.body, "valid")
              assert.strictEqual(res.body.valid, false);
              done();
            })
      })
      it('Check a puzzle placement with multiple placements conflict: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/projects/qa/sudoku/api/check')
            .send({
              puzzle: puzzle,
              coordinate: 'A2',
              value: '9'
            })
            .end((err,res) => {
              assert.equal(res.status, 200);
              assert.hasAnyKeys(res.body, "valid")
              assert.strictEqual(res.body.valid, false);
              assert.isArray(res.body.conflict, 'conflict should be an array');
              done();
            })
      })
      it('Check a puzzle placement with all placements conflict: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/projects/qa/sudoku/api/check')
            .send({
              puzzle: puzzle,
              coordinate: 'A2',
              value: '9'
            })
            .end((err,res) => {
              assert.equal(res.status, 200);
              assert.hasAnyKeys(res.body, "valid")
              assert.strictEqual(res.body.valid, false);
              assert.isArray(res.body.conflict, 'conflict should be an array');
              done();
            })
      })
      it('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/projects/qa/sudoku/api/check')
            .send({
              puzzle: puzzle,
              value: '9'
            })
            .end((err,res) => {
              assert.equal(res.status, 200);
              assert.strictEqual(res.body.error, 'Required field(s) missing');
              done();
            })
      })
      it('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/projects/qa/sudoku/api/check')
            .send({
              puzzle: puzzleWithBadChar,
              coordinate: 'A2',
              value: '9'
            })
            .end((err,res) => {
              assert.equal(res.status, 200);
              assert.strictEqual(res.body.error, 'Invalid characters in puzzle');
              done();
            })
      })
      it('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/projects/qa/sudoku/api/check')
            .send({
              puzzle: puzzleWithEightyChar,
              coordinate: 'A2',
              value: '9'
            })
            .end((err,res) => {
              assert.equal(res.status, 200);
              assert.strictEqual(res.body.error, 'Expected puzzle to be 81 characters long');
              done();
            })
      })
      it('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/projects/qa/sudoku/api/check')
            .send({
              puzzle: puzzle,
              coordinate: 'Z2',
              value: '9'
            })
            .end((err,res) => {
              assert.equal(res.status, 200);
              assert.strictEqual(res.body.error, 'Invalid coordinate');
              done();
            })
      })
      it('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/projects/qa/sudoku/api/check')
            .send({
              puzzle: puzzle,
              coordinate: 'A2',
              value: '91'
            })
            .end((err,res) => {
              assert.equal(res.status, 200);
              assert.strictEqual(res.body.error, 'Invalid value');
              done();
            })
      })
    });
  });
});

