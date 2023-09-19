function ConvertHandler() {

    function isFraction(exp) {
      //regex that checks if there's a slash
      let slashChecker = /\//g
      let resultOfCheck = exp.match(slashChecker)
      if(resultOfCheck) {
        //check if there is more than one /
        if(resultOfCheck.length > 1) {
          return 'too many slash'
        }
        else return true
      }
      return false;
    }
  
    function splitFraction(exp) {
      let splitDash = /\//
      let copy = exp
      let split = copy.split(splitDash);
      // console.log(split)
      return split
    }
  
    function retrieveNumber(inp) {
      let num = /^\d+\.*\d*/
      let arr = []
      inp.forEach(e => {
        arr.push(e.match(num))
      })
      // console.log(arr)
      let result = arr[0][0] / arr[1][0]
      let decimalString = result.toString();
      if(decimalString.includes('.')) {
        let decimalArray = decimalString.split(".");
        let decimalAfterPoint = decimalArray.pop();
        if(decimalAfterPoint.length > 0 && decimalAfterPoint.length < 5) result = result.toFixed(decimalAfterPoint.length)
        else if(decimalAfterPoint.length >= 5) result = result.toFixed(5)
        // console.log("The result of the fraction output is: " + result)
        // console.log("The type of the fraction output is: " + typeof result)
        return parseFloat(result);
      }
      return parseInt(result);
    }
    
    this.getNum = function(input) {
  
      //In the form we send number as string and in test as int
      //let's make sure we have our input as string so that we can match 
      //the regex later - we need to return as a number for the tests.
      if(typeof input !== String) {
        input = input.toString();
      }
      
      //We check if it's a fraction 1
      if(isFraction(input) === 'too many slash') {
        //if there is not more than one slash
        return 'invalid number'
      }
      else if(isFraction(input)) {
        let arr = splitFraction(input);
        let n = retrieveNumber(arr);
        return n
      }
      else {
        //if no number is provided we default to 1
        let noNumber = /^[a-z]+$/i
        if(input.match(noNumber)) {
          return 1
        }
        let num = /^\d+\.{0,1}\d*/
        let result = input.match(num)
        return parseInt(result[0]);
      }
  
      
  
      // //need to handle 3 . such as 2.1/2.2.1 -> error invalid number
  
      // let regEx = /\d+[\/\.]*\d*[\/\.]*\d*\.*\d*/
      // let result = input.match(regEx)
      // //return result only if we have a match
      // if(result) {
  
      //   let decimal = /^\d+\.\d+$/
      //   //if one decimal
      //   if(result[0].match(decimal)) {
      //     return parseFloat(result)
      //   }
  
      //   //if fraction (supports decimal for nominator and denominator)
      //   let fraction = /(\d+\.*\d*)\/(\d+\.*\d*)/
      //   if(result[0].match(fraction)) {
      //     let match = fraction.exec(result[0]);
      //     let nominator = match[1];
      //     let denominator = match[2];
      //     let returnNum = nominator / denominator
      //     return returnNum
      //   }
        
      //   return parseInt(result[0])
  
      // } else return "invalid number"
    };
    
    this.getUnit = function(input) {
      let regEx = /[a-z]+$/i
      let result = input.match(regEx)
      let unit = result[0].toLowerCase()
      switch(unit) {
        case 'gal':
          return 'gal'
        case 'l':
          return 'L'
        case 'mi':
          return 'mi'
        case 'km':
          return 'km'
        case 'kg':
          return 'kg'
        case 'lbs':
          return 'lbs'
        default:
          return "invalid unit";
      }
    };
    
    this.getReturnUnit = function(initUnit) {
      let result;
      switch(initUnit.toLowerCase()) {
        case 'gal':
          result = 'L'
          break;
        case 'l':
          result = 'gal'
          break;
        case 'mi':
          result = 'km'
          break;
        case 'km':
          result = 'mi'
          break;
        case 'kg':
          result = 'lbs'
          break;
        case 'lbs':
          result = 'kg'
          break;
        default:
          return 'invalid unit';
      }
      return result;
    };
  
    this.spellOutUnit = function(unit) {
      let result;
      switch(unit.toLowerCase()) {
        case 'gal':
          result = 'gallons'
          break;
        case 'l':
          result = 'liters'
          break;
        case 'mi':
          result = 'miles'
          break;
        case 'km':
          result = 'kilometers'
          break;
        case 'kg':
          result = 'kilograms'
          break;
        case 'lbs':
          result = 'pounds'
          break;
        default:
          return 'invalid unit';  
      }
      return result;
    };
    
    this.convert = function(initNum, initUnit) {
      const galToL = 3.78541;
      const lbsToKg = 0.453592;
      const miToKm = 1.60934;
      let result;
      switch(initUnit.toLowerCase()) {
        case 'gal':
          result = initNum * galToL;
          break;
        case 'l':
          result = initNum / galToL;
          break;
        case 'mi':
          result = initNum * miToKm;
          break;
        case 'km':
          result = initNum / miToKm;
          break;
        case 'kg':
          result = initNum / lbsToKg;
          break;
        case 'lbs':
          result = initNum * lbsToKg
          break;
        default:
          return false;
      }
      let decimalString = result.toString();
      if(decimalString.includes('.')) {
        let decimalArray = decimalString.split(".");
        let decimalAfterPoint = decimalArray.pop();
        if(decimalAfterPoint.length > 0 && decimalAfterPoint.length < 5) result = result.toFixed(decimalAfterPoint.length)
        else if(decimalAfterPoint.length >= 5) result = result.toFixed(5)
        // console.log("The result of the convert output is: " + result)
        // console.log("The type of the convert output is: " + typeof result)
        return parseFloat(result);
      }
      return parseInt(result);
    };
    
    this.getString = function(initNum, initUnit, returnNum, returnUnit) {
      let result;
      let invalidNumAndUnit = "invalid number and unit"
      if(initNum === "invalid number" && initUnit === "invalid unit") result = invalidNumAndUnit;
      else if(initNum === "invalid number") result = initNum
      else if(initUnit === "invalid unit") result = initUnit
      else result = `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`
      return result;
    };
    
  }
  
module.exports = ConvertHandler;
  