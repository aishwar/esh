
var assert = require('assert');
var colors = require('colors');
var NodeMap = require('../../lib/interpreter/load-node-map');
var atom = require('../atom');
var parser = require('../../lib/parser');

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
  
  //***********************
  // Beginning Node tests *
  //***********************
  
  describe('Nodes:', function () {
  
    describe('comparison: ', function () {
      var ComparisonNode = NodeMap['comparison'];
      var PASS = true, FAIL = false;
      
      function test(items) {
        items.forEach(function (item) {
          var comparison = 'if (' + item[0] + ') {}';
          var ifNode = parser.parse(comparison)[0];
          var expectation = (item[1]) ? assert.doesNotThrow : assert.throws;
          var run = (item[2]) ? it.only : it;
          
          run ('should ' + (item[1] ? 'pass' : 'fail') + ' validation on the comparison: '
            + item[0], function () {
            expectation(function () {
              ComparisonNode.validate(ifNode.condition);
            });
          });
        });
      }
      
      test([
        [ '$a > "hello"'        , PASS ],
        [ '$command.ok != 1'    , PASS ],
        [ 'number("123") > 12'  , PASS ],
        [ '$a > 5'                    , FAIL ],
        [ '"hello" < 5'               , FAIL ],
        [ '$command.ok != "y"'        , FAIL ],
        [ 'lines($command.out) >= 5'  , FAIL ]
      ]);
    });
    
  });
  
});