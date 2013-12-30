
var assert = require('assert');
var colors = require('colors');
var NodeMap = require('../../lib/interpreter/load-node-map');
var atom = require('../atom');
var parser = require('../../lib/parser');

describe('Interpreter:', function () {

  describe('Nodes:', function () {
    describe('comparison: ', function () {
      var ComparisonNode = NodeMap['comparison'];
      var PASS = true, FAIL = false;
      
      function test(items) {
        items.forEach(function (item) {
          var comparison = 'if (' + item[0] + ') {}';
          var ifNode = parser.parse(comparison).body[0];
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
    
    
    describe('"Usage" block: ', function () {
      var BlockNode = NodeMap['block'];
      
      it ('should pass validation when everything is a string in it\'s body', function () {
        var node = parser.parse([
          'Usage {',
          '   "abc"',
          '   "def"',
          '}'
        ].join('\n')).body[0];
        assert.doesNotThrow(function () { BlockNode.validate(node); });
      });
      
      it ('should fail validation when there is a non-string element in it\'s body', function () {
        var node = parser.parse([
          'Usage {',
          '   mv abc',
          '   "def"',
          '}'
        ].join('\n')).body[0];
        assert.throws(function () { BlockNode.validate(node); });
      });
    });
    
  });
  
});