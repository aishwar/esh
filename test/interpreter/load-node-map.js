
var assert = require('assert');
var NodeMap = require('../../lib/interpreter/load-node-map');

describe('Interpreter:', function () {

  describe('NodeMap:', function () {
    it ('contains valid nodes', function () {
      var NodeMap;
      assert.doesNotThrow(function () {
        // Make sure we can load all the nodes
        NodeMap = require('../../lib/interpreter/load-node-map');
      });
      
      // Make sure the loads are valid
      for (var key in NodeMap) {
        var node = NodeMap[key];
        assert.ok(typeof node.validate =='function', 
          ('"' + key + '#validate"').bold.yellow +  ' not found');
        assert.ok(typeof node.eval =='function', 
          ('"' + key + '#eval"').bold.yellow +  ' not found');
      }
    });
  });
  
});
