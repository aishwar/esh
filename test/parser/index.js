var assert = require('assert');
var parser = require('../../lib/parser');

describe('Parser', function () {

  function test(nodeType, testCases) {
    // testCases is a list, where each item is of the format:
    //   [ input, output, test-description ]
    testCases.forEach(function (detail) {
        var input = detail[0],
            description = detail[2],
            output,
            expected;
        
        // When a simple type is passed as the expected value, the node is expected to contain
        // a property called "value" with the expected value
        if (typeof detail[1] != "object") {
          expected = {
            type: nodeType,
            value: detail[1]
          }
        } else {
          // When an object is passed as the expected value, it is assumed this is the whole
          // object, except the "type" may not be filled as it repeats.
          expected = detail[1];
          expected.type = nodeType;
        }
        
        try {
          output = parser.parse(input)
        } catch (e) {
          if (e instanceof parser.SyntaxError) {
            throw new Error('Parser: Syntax error in input:\n\tInput:' + input + '\n\tError:' + e.message);
          }
        }
        
        if (description) {
          description += '.\n\tExpected: ' + JSON.stringify(expected) + '.\n\tReceived: ' + JSON.stringify(output);
        }
        // Do the deep equal, because I like to see the diff between the nodes
        assert.deepEqual(output, expected, description);
        // Ensure types are what we expect as well
        if (expected.value !== output.value) {
          throw new Error('Type error in value. Expected: ' + JSON.stringify(expected) + ', Received: ' + JSON.stringify(output));
        }
    });
  }

  it ('should parse strings', function () {
    test('literal:string', [
      [ "''", '', 'Single quoted empty string' ],
      [ '""', '', 'Double quoted empty string' ],
      [ "'hello'", 'hello', 'Single quoted string' ],
      [ '"hello"', 'hello', 'Double quoted string' ],
      [ '"\\"hello\\""', '"hello"', 'Single quoted string with escape sequence' ],
      [ "'\\'hello\\''", "'hello'", 'Double quoted string with escape sequence' ],
      [ '"' + "m'i'xed" + '"', "m'i'xed", 'Single quotes within double quoted string' ],
      [ "'" + 'm"i"xed' + "'", 'm"i"xed', 'Double quotes within single quoted string' ]
    ]);
  });
  
  it ('should parse numbers', function () {
    test('literal:number', [
      [ '1', 1, 'Integer number parsing'],
      [ '035', 35, 'Number should not be parsed as octal by leading 0']
    ]);
  });
  
  it ('should parse comments', function () {
    test('comment', [
      [ '# comment', ' comment', '']
    ]);
  });
  
  it ('should parse log messages', function () {
    test('log:out', [
      [ '## log', 'log', '']
    ]);
  });
  
  it ('should parse log-err messages', function () {
    test('log:err', [
      [ '#! error', 'error', '']
    ]);
  });
  
  it ('should parse operators', function () {
    test('operator', [
      [ '==', '==', 'Equal to' ],
      [ '!=', '!=', 'Not Equal to' ],
      [ '>' , '>' , 'Greater than' ],
      [ '>=', '>=', 'Greater than or equal to' ],
      [ '<' , '<' , 'Less than' ],
      [ '<=', '<=', 'Less than or equal to' ]
    ]);
  });
  
  it ('should parse variables', function () {
    test('variable', [
      [ '$var', 'var', 'Name with only letters'],
      [ '$vv1', 'vv1', 'Name with letters and numbers'],
      [ '$v.i', 'v.i', 'Name with dots (used when reading nested values)']
    ]);
  });
  
  it ('should parse whitespace', function () {
    test('whitespace', [
      [ ' ', ' ', 'Single Space'],
      [ '   ', '   ', 'Multiple Spaces'],
      [ '\n \n', '\n \n', 'Newline'],
      [ '\r \r', '\r \r', 'Carriage Returns'],
      [ ' \t \t ', ' \t \t ', 'Tabs']
    ]);
  });
  
  it ('should parse comparisons', function () {
    function atom(type, val) {
      return {
        type: type,
        value: val
      }
    }
    
    test('comparison', [
      [ '$a > 1', {
          operator: atom('operator', '>'),
          left: atom('variable', 'a'),
          right: atom('literal:number', 1)
        },
        '<variable> <operator> <number> : greater than' ],
        
      [ '$a != 1', {
          operator: atom('operator', '!='),
          left: atom('variable', 'a'),
          right: atom('literal:number', 1)
        },
        '<variable> <operator> <number> : not equal to' ],
      
      [ '1\t==\t\t1', {
          operator: atom('operator', '=='),
          left: atom('literal:number', 1),
          right: atom('literal:number', 1)
        },
        '<number> <whitespace> <operator> <whitespace> <number> : equal to' ],
        
      [ '$command.err != ""', {
          operator: atom('operator', '!='),
          left: atom('variable', 'command.err'),
          right: atom('literal:string', "")
        },
        '<nested.variable> <operator> <string> : not equal to' ],
        
      [ '\t\t"done" == $command.out', {
          operator: atom('operator', '=='),
          left: atom('literal:string', 'done'),
          right: atom('variable', 'command.out')
        },
        '[start-of-line-whitespace] <string> <operator> <nested.variable> : equal to' ],
        
      [ '\t\t"done" == $command.out\t\t\t\n', {
          operator: atom('operator', '=='),
          left: atom('literal:string', 'done'),
          right: atom('variable', 'command.out')
        },
        '<string> <operator> <nested.variable> [end-of-line-whitespace] : equal to' ]
    ]);;
  });
});
