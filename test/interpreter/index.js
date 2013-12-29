
var assert = require('assert');
var colors = require('colors');
var NodeMap = require('../../lib/interpreter/load-node-map');
var atom = require('../atom');

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
  
  function compare(left, right) {
    return {
      type: 'comparison',
      left: left,
      right: right,
      operator: '==',
      position: {
        line: 0,
        column: 0,
        toString: function () {
          return 'line 0, column 0';
        }
      }
    };
  }
  
  //***********************
  // Beginning Node tests *
  //***********************
  
  describe('Nodes:', function () {
    describe('comparison: ', function () {
      
      var ComparisonNode = NodeMap['comparison'];
      var PASS = true, FAIL = false;
      
      function makeNode(type) {
        switch (type) {
          case 'lines':
            return {
              name: 'lines',
              input: 'abc',
              type: 'operation',
              valueType: 'array'
            };
          case 'number':
            return {
              name: 'number',
              input: '"123"',
              type: 'operation',
              valueType: 'number'
            }
          case '$command.ok':
            return atom('variable', 'command.ok');
          case 'variable':
          case 'literal:string':
          case 'literal:number':
            return atom(type, '0');
          default:
            throw new Error('Unknown Node type: ' + type);
        }
      }
      
      function test(items) {
        items.forEach(function (item) {
          var leftNode = makeNode(item[0]);
          var rightNode = makeNode(item[1]);
          var expectation = (item[2]) ? assert.doesNotThrow : assert.throws;
          
          it ('should ' + (item[2] ? 'pass' : 'fail') + ' validation when comparing '
            + item[0] + ' and ' + item[1], function () {
            expectation(function () {
              ComparisonNode.validate(compare(leftNode, rightNode));
            });
          });
        });
      }
      
      test([
        [ 'variable'        , 'literal:string'  , PASS ],
        [ '$command.ok'     , 'literal:number'  , PASS ],
        [ 'number'          , 'literal:number'  , PASS ],
        [ 'variable'        , 'literal:number'  , FAIL ],
        [ 'literal:string'  , 'literal:number'  , FAIL ],
        [ '$command.ok'     , 'literal:string'  , FAIL ],
        [ 'lines'           , 'literal:number'  , FAIL ]
      ]);
    });
  });
  
});