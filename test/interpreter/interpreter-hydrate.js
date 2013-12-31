
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

  function node(str) {
    var rawRootNode = parser.parse(str);
    var interpreter = new Interpreter(rawRootNode);
    var outputNode = interpreter.rootNode.body[0];
    return outputNode;
  }

  function ensureNoChildren(desc, str, exclusive) {
    ensureChildren(desc + ' contain no children', str, [], exclusive);
  }

  function ensureChildren(desc, str, expectation, exclusive) {
    ((exclusive) ? it.only : it) (desc, function () {
      var targetNode = node(str);
      var visited = [];
      targetNode.forEachChild(function (child) {
        visited.push(child.type);
      });
      assert.sameMembers(visited, expectation);
    });
  }

  describe('Behavior:', function () {
    describe('forEachChild: ', function () {

      // Leaf nodes
      ensureNoChildren('comment', '# comments');
      ensureNoChildren('command', 'command');
      ensureNoChildren('special-word', 'exit:bad');
      ensureNoChildren('empty block', 'Usage {}');
      ensureNoChildren('variable', '$hello');
      ensureNoChildren('literal:string', '"hello"');
      ensureNoChildren('literal:number', '5');
      ensureNoChildren('log:out', '## log');
      ensureNoChildren('log:err', '#! error');

      // Non-leaf nodes

      // operation
      ensureChildren('operation contains the input as a child', 'number("abc")',
        [ 'literal:string' ]);

      // loop
      ensureChildren('loop contains the list, value and index as children',
        'loop (lines("abc") : $a, $b) {}',
        [ 'operation', 'variable', 'variable' ]);

      // if test 1
      ensureChildren('if statement with comparison and 2 expressions in body contain all 3 as children',
        [
          'if ($a > 1) {',
          '   ## Print',
          '   mv abc def',
          '}'
        ].join('\n'),
        [ 'comparison', 'log:out', 'command']);

      // if test 2
      ensureChildren('if statement with not expression and 2 expressions in body contain all 3 as children',
        [
          'if (!$command.ok) {',
          '   #! Error',
          '}'
        ].join('\n'),
        [ 'not', 'log:err' ]);

      // if-else
      ensureChildren('if statement with not expression and 2 expressions in body contain all 3 as children',
        [
          'if ($command.ok) {',
          '   ## Done',
          '} else {',
          '   #! Error',
          '}'
        ].join('\n'),
        [ 'variable', 'log:out', 'log:err' ]);

      // block
      ensureChildren('Main block with statements inside contains those statements as children',
        [
          'Main {',
          '   if (!$command.ok) {',
          '      #! Error',
          '   }',
          '   ## Hello welcome',
          '}'
        ].join('\n'),
        [ 'if', 'log:out' ]);

    });
  });
  
});