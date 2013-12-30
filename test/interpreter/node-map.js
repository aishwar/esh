
var colors = require('colors');
var chai = require('chai');
var assert = chai.assert;
var NodeMap = require('../../lib/interpreter/load-node-map');

describe('Interpreter:', function () {

  describe('NodeMap:', function () {
    var NodeMap = require('../../lib/interpreter/load-node-map');
    
    Object.keys(NodeMap).forEach(function (key) {
      it ('should contain a valid "' + key + '" node', function () {
        var NodeConstructor = NodeMap[key];
        assert.isFunction(NodeConstructor.prototype.validate);
        assert.isFunction(NodeConstructor.prototype.eval);
      });
    });
  });
  
});
