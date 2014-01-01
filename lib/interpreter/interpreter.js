
var hydrate = require('./hydrate');
var ValidationError = require('./errors/ValidationError');
var RuntimeContext = require('./runtime-context');

function Interpreter(rawRootNode) {
  this.rawRootNode = rawRootNode;
  this.rootNode = hydrate(rawRootNode);
  this.context = new RuntimeContext();
}

Interpreter.prototype.validate = function () {
  this.rootNode.validate();
};

Interpreter.prototype.execute = function () {
  this.rootNode.evaluate(this.context);
};

Interpreter.prototype.run = function () {
  try {
    this.validate();
    this.execute();
  } catch (e) {
    if (e instanceof ValidationError) {
      console.error('[validation error]', e.message);
    } else {
      console.error('An error ocurred:', e.message);
    }
  }
};

module.exports = Interpreter;
