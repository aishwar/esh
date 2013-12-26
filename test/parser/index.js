var assert = require('assert');
var parser = require('../../lib/parser');

describe('Parser', function () {

  function test(nodeType, testCases) {
    // testCases is a list, where each item is of the format:
    //   [ input, output, test-description ]
    testCases.forEach(function (detail) {
        var input = detail[0],
            description = detail[2],
            output = parser.parse(input),
            expected = {
              type: nodeType,
              value: detail[1]
            };
        if (description) {
          description += '.\n\tExpected: ' + JSON.stringify(expected) + '. Received: ' + JSON.stringify(output);
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
      [ "'hello'", "hello", 'Single quoted string' ],
      [ '"hello"', "hello", 'Double quoted string' ],
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
});
