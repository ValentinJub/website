const chai = require('chai');
// // const { suite, test } = require('mocha');
let assert = chai.assert;
const ConvertHandler = require('../../controllers/metric-converter/convertHandler.js');

let convertHandler = new ConvertHandler();

describe('Unit Tests', function(){
  describe('Read Inputs', function() {
    //#1
    it('Read a whole number input', function() {
      let N = Math.floor(Math.random() * 100 + 1)
      assert.isNumber(convertHandler.getNum(N), 'Is a number')
    })
    //#2
    it('Read a decimal number input', function() {
      let N = Math.random() * 10;
      assert.isNumber(convertHandler.getNum(N), 'Is a decimal number')
    })
    //#3
    it('Read a fractional number input', function() {
      let N1 = Math.floor(Math.random() * 100 + 1)
      let N2 = Math.floor(Math.random() * 100 + 1)
      assert.isNumber(convertHandler.getNum("" + N1 + "/" + N2), 'Is a fractional number')
    })
    //#4
    it('Read a fractional input with decimal', function() {
      let N1 = Math.random() * 100 + 1
      let N2 = Math.random() * 100 + 1
      assert.isNumber(convertHandler.getNum("" + N1 + "/" + N2), 'Is a fractional number with decimal')
    })
    //#5
    it('Return an error on a double-fraction', function() {
      let N1 = Math.floor(Math.random() * 100 + 1)
      let N2 = Math.floor(Math.random() * 100 + 1)
      let N3 = Math.floor(Math.random() * 100 + 1)
      assert.strictEqual(convertHandler.getNum(N1 + "/" + N2 + "/" + N3), 'invalid number')
    })
    //#6
    it('Default to a numerical input of 1 when no numerical input is provided.', function() {
      let input = 'noNumeric'
      assert.strictEqual(convertHandler.getNum(input), 1)
    })
    //#7
    it('read each valid input unit', function() {
      let units = ['gal', 'L', 'km', 'mi', 'kg', 'lbs']
      assert.isTrue(units.includes(convertHandler.getUnit('gAl')))
      assert.isTrue(units.includes(convertHandler.getUnit('L')))
      assert.isTrue(units.includes(convertHandler.getUnit('MI')))
      assert.isTrue(units.includes(convertHandler.getUnit('KM')))
      assert.isTrue(units.includes(convertHandler.getUnit('lBS')))
      assert.isTrue(units.includes(convertHandler.getUnit('Kg')))
      assert.isFalse(units.includes(convertHandler.getUnit('mil')))
      assert.isFalse(units.includes(convertHandler.getUnit('min')))
    })
    //#8
    it('Return an error for an invalid input unit', function() {
      assert.strictEqual(convertHandler.getUnit('mil'), 'invalid unit')
      assert.strictEqual(convertHandler.getUnit('min'), 'invalid unit')
      assert.strictEqual(convertHandler.getUnit('g'), 'invalid unit')
      assert.strictEqual(convertHandler.getUnit('m'), 'invalid unit')
      assert.strictEqual(convertHandler.getUnit('oz'), 'invalid unit')
      assert.strictEqual(convertHandler.getUnit('hello'), 'invalid unit')
    })
    //#9
    it('Return the correct return unit for each valid input unit', function() {
      assert.strictEqual(convertHandler.getReturnUnit('mi'), 'km')
      assert.strictEqual(convertHandler.getReturnUnit('km'), 'mi')
      assert.strictEqual(convertHandler.getReturnUnit('kg'), 'lbs')
      assert.strictEqual(convertHandler.getReturnUnit('lbs'), 'kg')
      assert.strictEqual(convertHandler.getReturnUnit('gal'), 'L')
      assert.strictEqual(convertHandler.getReturnUnit('l'), 'gal')
    })
    //#10
    it('Correctly return the spelled-out string unit for each valid input unit.', function() {
      assert.strictEqual(convertHandler.spellOutUnit('mi'), 'miles')
      assert.strictEqual(convertHandler.spellOutUnit('km'), 'kilometers')
      assert.strictEqual(convertHandler.spellOutUnit('lbs'), 'pounds')
      assert.strictEqual(convertHandler.spellOutUnit('kg'), 'kilograms')
      assert.strictEqual(convertHandler.spellOutUnit('l'), 'liters')
      assert.strictEqual(convertHandler.spellOutUnit('gal'), 'gallons')
    })
    //#11
    it('Convert kilometers to miles', function() {
      assert.strictEqual(convertHandler.convert(1, "km"),  0.62137)
    })
    //#12
    it('Convert miles to kilometers', function() {
      assert.strictEqual(convertHandler.convert(23, "mi"),  37.01482)
    })
    //#13
    it('Convert gallons to liters', function() {
      assert.strictEqual(convertHandler.convert(66, "gal"),  249.83706)
    })
    //#14
    it('Convert liters to gallons', function() {
      assert.strictEqual(convertHandler.convert(25/4, "l"),  1.65108)
    })
    //#15
    it('Convert kilograms to pounds', function() {
      assert.strictEqual(convertHandler.convert(1/3, "kg"),  0.73487)
    })
    //#16
    it('Convert pounds to kilograms', function() {
      assert.strictEqual(convertHandler.convert(27, "lbs"),  12.24698)
    })    
  });
});