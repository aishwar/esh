
var assert = require('assert');
var colors = require('colors');

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
  
  describe('Methods:', function () {
    it ('#forEachNode', function () {
      var Interpretter = require('../../lib/interpreter');
      var input = [{obj: 1}, {obj: 2}];
      var output = [];
      var interpretter = new Interpretter(input);
      
      interpretter.forEachNode(function (node) {
        output.push(node);
      });
      
      assert.deepEqual(input, output);
    });
  });
  
});