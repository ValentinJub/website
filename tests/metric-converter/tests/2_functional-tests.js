const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../../../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(5000);
  suite('Conversion tests with chai-http', function () {
    // #1
    test('Convert a valid input such as 10L: GET request to /api/convert', function (done) {
      chai
        .request(server)
        .get('/projects/qa/metric-converter/api/convert?input=10l')
        .end(function (err, res) {
          if(err) return console.error(err)
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.string, "10 liters converts to 2.64172 gallons");
          done();
        });
    });
    // #2
    test('Convert an invalid input such as 32g: GET request to /api/convert', function (done) {
      chai
        .request(server)
        .get('/projects/qa/metric-converter/api/convert?input=32g')
        .end(function (err, res) {
          if(err) return console.error(err)
          assert.equal(res.status, 200);
          assert.equal(res.type, "text/html");
          assert.equal(res.text, "invalid unit");
          done();
        });
    });
    // #3
    test('Convert an invalid number such as 3/7.2/4kg: GET request to /api/convert', function (done) {
      chai
        .request(server)
        .get('/projects/qa/metric-converter/api/convert?input=3/7.2/4kg')
        .end(function (err, res) {
          if(err) return console.error(err)
          assert.equal(res.status, 200);
          assert.equal(res.type, "text/html");
          assert.equal(res.text, "invalid number");
          done();
        });
    });
    // #4
    test('Convert an invalid number AND unit such as 3/7.2/4kilomegagram: GET request to /api/convert', function (done) {
      chai
        .request(server)
        .get('/projects/qa/metric-converter/api/convert?input=3/7.2/4kilomegagram')
        .end(function (err, res) {
          if(err) return console.error(err)
          assert.equal(res.status, 200);
          assert.equal(res.type, "text/html");
          assert.equal(res.text, "invalid number and unit");
          done();
        });
    });
    // #5
    test('Convert with no number such as kg: GET request to /api/convert', function (done) {
      chai
        .request(server)
        .get('/projects/qa/metric-converter/api/convert?input=kg')
        .end(function (err, res) {
          if(err) return console.error(err)
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.string, "1 kilograms converts to 2.20462 pounds");
          done();
        });
    });

  });
});
