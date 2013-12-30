
var hydrate = require('./hydrate');
var ValidationError = require('./errors/ValidationError');

function Interpreter(rawRootNode) {
  this.rawRootNode = rawRootNode;
  this.rootNode = hydrate(rawRootNode);
}

Interpreter.prototype.validate = function () {
  this.rootNode.validate();
};

Interpreter.prototype.eval = function () {
  this.rootNode.eval();
};

Interpreter.prototype.run = function () {
  try {
    this.rootNode.validate();
    this.rootNode.eval();
  } catch (e) {
    if (e instanceof ValidationError) {
      console.error('[validation error] ', e.message);
    }
  }
};

module.exports = Interpreter;
