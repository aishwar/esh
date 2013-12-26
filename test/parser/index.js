var assert = require('assert');
var parser = require('../../lib/parser');

describe('Parser', function () {

  it ('should parse strings', function () {
    var tests = [
      // [ input, output, test-description ]
      [ "'hello'", "hello", "Single quoted string" ],
      [ '"hello"', "hello", "Double quoted string" ],
      [ '"\\"hello\\""', '"hello"', "Single quoted string with escape sequence" ],
      [ "'\\'hello\\''", "'hello'", "Double quoted string with escape sequence" ],
      [ '"' + "m'i'xed" + '"', "m'i'xed", "Single quotes within double quoted string" ],
      [ "'" + 'm"i"xed' + "'", 'm"i"xed', "Double quotes within single quoted string" ]
    ];
    
    tests.forEach(function (test) {
      try {
        assert.deepEqual(parser.parse(test[0]), {
          type: 'quoted-string',
          value: test[1]
        });
      } catch (e) {
        console.error(e);
        assert.fail(test[2]);
      }
    });
  });
  
  
  
});