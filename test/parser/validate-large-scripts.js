require('colors');
var fs = require('fs');
var assert = require('assert');
var parser = require('../../lib/parser');
var keyOrderedJsonStringify = require('./helper/key-ordered-json-stringify');
var diffString = require('json-diff').diffString;
var removePositionData = require('./helper/remove-position-data');

function test(description, inputFileName) {
  describe(description, function () {
    it ('should produce right AST', function () {
      var input = fs.readFileSync(__dirname + '/fixtures/' + inputFileName + '.jsh', 'utf8');
      var expected;
      var output;
      
      try {
        output = parser.parse(input);
        removePositionData(output);
      } catch (e) {
        if (e instanceof parser.SyntaxError) {
          e.message = (('\n\tSyntax error at line: ' + e.line + ', column: ' + e.column + '.\n\t' +
            e.message).yellow);
        }
        throw e;
      }
      
      // Write out the results of the last run
      var generatedOutputFileName = __dirname + '/fixtures/generated-output-' + inputFileName + '.txt';
      fs.writeFileSync(generatedOutputFileName, keyOrderedJsonStringify(output), 'utf8');
      
      // Read in the expectations
      var expectedOutputFileName = __dirname + '/fixtures/expected-output-' + inputFileName + '.txt';
      if (!fs.existsSync(expectedOutputFileName)) {
        console.log('[WARNING] Expected file doesn\'t exist, assuming this was an output generation run'.yellow +
          '\nNothing was tested here'.bold.yellow);
        return;
      }
      
      expected = fs.readFileSync(expectedOutputFileName, 'utf8');
      try {
        expected = JSON.parse(expected);
      } catch (e) {
        e.message = 'The provided "expected AST" file contains invalid JSON. Please correct ' +
          'this file: ' + expectedOutputFileName;
        throw e;
      }
      
      // Prepare the failure message and assert!
      var failureMessage = 'Here is the difference from expectation:\n'.white +
        diffString(expected, output);
      assert.deepEqual(expected, output, failureMessage);
    });
  });
}

describe('Parser should parse:', function () {
  test('Multiline program with comment, log, if/else, comparison etc.', 'input1');
  test('Sample bash script from the web', 'input2');
  test('The dream "jsh" file', 'input-dream');
});
