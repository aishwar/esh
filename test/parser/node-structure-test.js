var chai = require('chai');
var assert = chai.assert;
var parser = require('../../lib/parser');

describe('Parser:', function () {

  var props = {
    'comment': ['type', 'value'],
    'command': ['type', 'value', 'directives', 'errorMessage'],
    'special-word': ['type', 'name'],
    'operation': ['type', 'name', 'input', 'valueType'],
    'loop': ['type', 'list', 'valueProperty', 'indexProperty', 'body'],
    'block': ['type', 'name', 'body'],
    'if': ['type', 'condition', 'body', 'alternate'],
    'comparison': ['type', 'operator', 'left', 'right'],
    'not': ['type', 'value', 'valueType'],
    'variable': ['type', 'name', 'valueType'],
    'log:err': ['type', 'value'],
    'log:out': ['type', 'value'],
    'literal:number': ['type', 'value', 'valueType'],
    'literal:string': ['type', 'value', 'valueType']
  };

  function ensure(str) {
    var rootNode = parser.parse(str);
    var outputNode = rootNode.body[0];

    outputNode.is = {};
    outputNode.is.a = function (type) {
      it('produces the right structure for <' + type + ' node>: ' + str, function () {
        assert.equal(outputNode.type, type);
        assert.includeMembers(Object.keys(outputNode), props[type],
          'input: "' + str + '"" failed structure validation\n\t');
      });
    };

    return outputNode;
  }

  // Comment
  ensure('# hello').is.a('comment');

  // Command
  ensure('mv abc def').is.a('command');
  ensure('mv abc def # abc').is.a('command');
  ensure('mv abc #! def').is.a('command');

  // Special words
  ensure('exit:bad').is.a('special-word');
  ensure('exit:ok').is.a('special-word');

  // Operation
  ensure('number("abc")').is.a('operation');
  ensure('lines("abc")').is.a('operation');
  ensure('glob("abc")').is.a('operation');

  // Loop
  ensure('loop(lines("abc") : $val, $idx) {}').is.a('loop');

  // Blocks
  ensure('Usage {}').is.a('block');
  ensure('Main {}').is.a('block');
  ensure('OnError {}').is.a('block');
  ensure('CleanUp {}').is.a('block');

  // If
  ensure('if ($abc) {}').is.a('if');
  ensure('if ($abc) {} else {}').is.a('if');

  // Variable
  ensure('$abc').is.a('variable');

  // Log:err
  ensure('#! err').is.a('log:err');

  // Log:out
  ensure('## out').is.a('log:out');

  // Number
  ensure('5').is.a('literal:number');

  // String
  ensure('\'Hello World\'').is.a('literal:string');
  ensure('"Hello World"').is.a('literal:string');
});
