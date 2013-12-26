var assert = require('assert');
var parser = require('../../lib/parser');

describe('Parser', function () {

  function test(nodeType, testCases) {
    // testCases is a list, where each item is of the format:
    //   [ input, output, test-description ]
    testCases.forEach(function (detail) {
        var input = detail[0],
            expectedValue = detail[1],
            description = detail[2];
        assert.deepEqual(parser.parse(input), {
          type: nodeType,
          value: expectedValue
        });
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
