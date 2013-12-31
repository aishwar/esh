var chai = require('chai');
var assert = chai.assert;
var RuntimeContext = require('../../../lib/interpreter/runtime-context');

describe('Runtime Context', function () {
  describe('currentScope:', function () {
    it('points to the globalScope by default', function () {
      var context = new RuntimeContext();

      context.currentScope.greetings = 'hello';
      assert.equal(context.globalScope.greetings, 'hello');
    });

    it('points to a new scope if one is created', function () {
      var context = new RuntimeContext();

      context.currentScope.level = '1';
      context.newScope();
      context.currentScope.level = '2';
      assert.equal(context.currentScope.level, '2');
    });

    it('retrieves values from a parent scope, if it does not contain a value', function () {
      var context = new RuntimeContext();

      context.currentScope.level = '1';
      context.currentScope.greetings = 'hello';
      context.newScope();
      context.currentScope.level = '2';
      // Value from the new scope
      assert.equal(context.currentScope.level, '2');
      // Value the new scope does not contain and should be looked up at the parent
      assert.equal(context.currentScope.greetings, 'hello');
    });

    it('falls back to the parent scope, when the current one is ended', function () {
      var context = new RuntimeContext();

      context.currentScope.level = '1';
      assert.equal(context.currentScope.level, '1');

      context.newScope();
      context.currentScope.level = '2';
      assert.equal(context.currentScope.level, '2');

      context.endScope();
      assert.equal(context.currentScope.level, '1');
    });
  });

  describe('loadValuesFromFile', function () {
    it('loads values from file into the globalScope', function () {
      var context = new RuntimeContext();
      context.loadValuesFromFile(__dirname + '/fixtures/input.vals');
      assert.deepEqual(context.globalScope, {
        greetings: {
          'en': 'Hello',
          'fr': 'Bonjour'
        },
        currentLang: 'en'
      });
    });
  });

  describe('retrieveValue', function () {
    it('retrieves values from currentScope', function () {
      var context = new RuntimeContext();

      context.currentScope.level = '1';
      context.currentScope.greetings = {
        'en': {
          'formal': 'hello',
          'casual': 'yo',
        },
        'fr': {
          'formal': 'bonjour'
        }
      };

      assert.equal(context.retrieveValue('level'), '1');
      assert.equal(context.retrieveValue('greetings.en.formal'), 'hello');
      assert.equal(context.retrieveValue('greetings.en.casual'), 'yo');
      assert.isUndefined(context.retrieveValue('unknown'));
    });
  });

  describe('retrieveGlobalValue', function () {
    it('retrieves values from globalScope', function () {
      var context = new RuntimeContext();

      context.currentScope.level = '1';
      context.currentScope.greetings = {
        'en': {
          'formal': 'hello',
          'casual': 'yo',
        },
        'fr': {
          'formal': 'bonjour'
        }
      };

      context.newScope();
      context.currentScope.level = '2';
      context.currentScope.greetings = 'none';

      // Show distinction between retrieveValue and retrieveGlobalValue
      assert.equal(context.retrieveValue('level'), '2');
      assert.equal(context.retrieveGlobalValue('level'), '1');

      // Show distinction between retrieveValue and retrieveGlobalValue
      assert.isUndefined(context.retrieveValue('greetings.en.formal'));
      assert.equal(context.retrieveGlobalValue('greetings.en.formal'), 'hello');

      // Unknown values retrieved at globalScope return undefined
      assert.isUndefined(context.retrieveGlobalValue('unknown'));
    });
  });
});
