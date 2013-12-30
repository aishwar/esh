
/* jshint sub:true */

var chai = require('chai');
var assert = chai.assert;
var parser = require('../../lib/parser');
var Interpreter = require('../../lib/interpreter');
var NodeMap = require('../../lib/interpreter/load-node-map');

describe('Interpreter:', function () {

  describe('parseTree hydration:', function () {
    var rawRootNode;
    var interpreter;
    
    before(function () {
      rawRootNode = parser.parse(
        [
          'Main {',
          '  if (number($command.out) > 1) {',
          '    ## Command output was greater than 1',
          '    echo "Good Job!"',
          '  } else {',
          '    #! Command output was less than or equal to 1',
          '  }',
          '}'
        ].join('\n')
      );
      interpreter = new Interpreter(rawRootNode);
    });
    
    it ('stores a reference to the raw parse tree', function () {
      assert.deepEqual(rawRootNode, interpreter.rawRootNode);
    });
    
    it ('expands the JSON nodes to JS objects correctly', function () {
      var rootNode = interpreter.rootNode;
      
      assert.instanceOf(rootNode, NodeMap['root']);
      assert.property(rootNode, 'body');
      assert.instanceOf(rootNode.body, Array);
      
      var mainBlock = rootNode.body[0];
      assert.instanceOf(mainBlock, NodeMap['block']);
      assert.property(mainBlock, 'body');
      
      var ifBlock = mainBlock.body[0];
      assert.instanceOf(ifBlock, NodeMap['if']);
      assert.property(ifBlock, 'condition');
      
      var conditionBlock = ifBlock.condition;
      assert.instanceOf(conditionBlock, NodeMap['comparison']);
      assert.equal(conditionBlock.operator, '>');
      assert.property(conditionBlock, 'left');
      assert.property(conditionBlock, 'right');
      
      var operationBlock = conditionBlock.left;
      assert.instanceOf(operationBlock, NodeMap['operation']);
      assert.equal(operationBlock.name, 'number');
      assert.property(operationBlock, 'input');
      
      var variableBlock = operationBlock.input;
      assert.instanceOf(variableBlock, NodeMap['variable']);
      assert.equal(variableBlock.name, 'command.out');
      
      var literalNumberBlock = conditionBlock.right;
      assert.instanceOf(literalNumberBlock, NodeMap['literal:number']);
      assert.equal(literalNumberBlock.value, 1);
      
      // Ensure correct number of statements exist within if/else blocks
      assert.lengthOf(ifBlock.body, 2);
      assert.lengthOf(ifBlock.alternate, 1);
    });
  });
  
});