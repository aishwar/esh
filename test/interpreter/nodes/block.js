
var assert = require('assert');
var node = require('../helpers/node');

describe('Interpreter:', function () {
  describe('Nodes:', function () {
    
    describe('"Usage" block: ', function () {
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
    });

  });
});
