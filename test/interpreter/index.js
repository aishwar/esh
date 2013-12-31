
var assert = require('assert');
var colors = require('colors');
var atom = require('../atom');
var parser = require('../../lib/parser');
var Interpreter = require('../../lib/interpreter');

describe('Interpreter:', function () {

  describe('Nodes:', function () {
  
    function node(str) {
      var rawRootNode = parser.parse(str);
      var interpreter = new Interpreter(rawRootNode);
      var outputNode = interpreter.rootNode.body[0];
      return outputNode;
    }

    describe('if: ', function () {
      var PASS = true, FAIL = false;
      
      function testComparisons(items) {
        items.forEach(function (item) {
          var str = 'if (' + item[0] + ') {}';
          var ifNode = node(str);
          var expectation = (item[1]) ? assert.doesNotThrow : assert.throws;
          var run = (item[2]) ? it.only : it;
          
          run ('should ' + (item[1] ? 'pass' : 'fail') + ' validation on the comparison: ' +
            item[0], function () {
            expectation(function () {
              ifNode.validate(ifNode.condition);
            });
          });
        });
      }
      
      testComparisons([
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
      /*
      it ('should pass validation when everything is a string in it\'s body', function () {
        var targetNode = node([
          'Usage {',
          '   "abc"',
          '   "def"',
          '}'
        ].join('\n'));
        assert.doesNotThrow(function () { targetNode.validate(); });
      });
      
      it ('should fail validation when there is a non-string element in it\'s body', function () {
        var targetNode = node([
          'Usage {',
          '   mv abc',
          '   "def"',
          '}'
        ].join('\n'));
        assert.throws(function () { targetNode.validate(); });
      });
*/
    });
    
  });
  
});