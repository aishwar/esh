
var fs = require('fs')
var chai = require('chai');
var colors = require('colors');
var parser = require('../../../lib/parser');
var Interpreter = require('../../../lib/interpreter');
var ValidationError = require('../../../lib/interpreter/errors/ValidationError');
var assert = chai.assert;

var fixturePrefix = __dirname + '/../fixtures/root-node-validation/';

describe('Interpreter:', function () {
  describe('Root Node:', function () {
  
  
    it ('validates on correct input', function () {
      assert.doesNotThrow(function () {
        var rawRootNode = parser.parse(fs.readFileSync(fixturePrefix + 'input1-good.jsh', 'utf8'));
        var interpreter = new Interpreter(rawRootNode);
        interpreter.validate();
      });
    });
    
    
    it ('validates on correct input (with multiple load statements)', function () {
      assert.doesNotThrow(function () {
        var rawRootNode = parser.parse(fs.readFileSync(fixturePrefix + 'input2-good.jsh', 'utf8'));
        var interpreter = new Interpreter(rawRootNode);
        interpreter.validate();
      });
    });
    
    
    it ('fails validation on incorrect input (load statement after block)', function () {
      assert.throws(function () {
        var rawRootNode = parser.parse(fs.readFileSync(fixturePrefix + 'input3-bad.jsh', 'utf8'));
        var interpreter = new Interpreter(rawRootNode);
        interpreter.validate();
      }, ValidationError);
    });
    
    
    it ('fails validation on incorrect input (repeated block)', function () {
      assert.throws(function () {
        var rawRootNode = parser.parse(fs.readFileSync(fixturePrefix + 'input4-bad.jsh', 'utf8'));
        var interpreter = new Interpreter(rawRootNode);
        interpreter.validate();
      }, ValidationError);
    });
    
    
    it ('fails validation on incorrect input (non-load operation)', function () {
      assert.throws(function () {
        var rawRootNode = parser.parse(fs.readFileSync(fixturePrefix + 'input5-bad.jsh', 'utf8'));
        var interpreter = new Interpreter(rawRootNode);
        interpreter.validate();
      }, ValidationError);
    });
    
  });
});