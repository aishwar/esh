var fs = require('fs');
var assert = require('assert');
var exec = require('child_process').exec;

describe('esh script execution', function () {
  it('works as expected', function (done) {
    exec('node ../../index.js fixtures/simple.esh',
      {cwd: __dirname},
      function (error, stdout, stderr) {
        // Store the generated output
        var generatedOutput = stdout.replace(/[\r\n]+/g, '\n');
        var generatedError = stderr.replace(/[\r\n]+/g, '\n');
        fs.writeFileSync(__dirname + '/fixtures/generated-output.txt', generatedOutput, 'utf8');
        fs.writeFileSync(__dirname + '/fixtures/generated-error.txt', generatedError, 'utf8');

        // Retrieve the expected output
        var expectedOutput = fs.readFileSync(__dirname + '/fixtures/expected-output.txt', 'utf8');
        var expectedError = fs.readFileSync(__dirname + '/fixtures/expected-error.txt', 'utf8');

        // Do the assertion
        assert.equal(generatedOutput, expectedOutput);
        assert.equal(generatedError, expectedError);
        done();
      });
  });
});
