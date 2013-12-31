
var ValidationError = require('../errors/ValidationError');

function BaseNode() {
}

/**
 * Method that runs in the validation cycle of the interpreter. This method ensures
 * the given AST is valid.
 * 
 * Method should call throwValidationError if any expectations needed by this node are not true.
 */
BaseNode.prototype.validate = function () {
  this.validateChildren();
  return true;
};

/**
 * Method that iterates over the children of this node and ensures they are valid
 */
BaseNode.prototype.validateChildren = function () {
  this.forEachChild(function (child) {
    child.validate();
  });
};


/**
 * Method that runs in the execution cycle of the interpreter. This method evaluates
 * the current node and performs the necessary action.
 */
BaseNode.prototype.evaluate = function () {};

/**
 * Iterator to traverse all the children nodes of this node
 * @param {function(node, context)} callback Function to call on each child node
 */
BaseNode.prototype.forEachChild = function (callback) {

  function invokeCallback(item) {
    if (item instanceof BaseNode) callback.call(item, item);
  }

  // Go through all the properties of the current object and invoke the callback
  // on properties that are AST nodes
  for (var key in this) {
    if (this.hasOwnProperty(key)) {
      var value = this[key];
      if (value instanceof BaseNode) {
        invokeCallback(value);
      }
      else if (value instanceof Array) {
        value.forEach(invokeCallback);
      }
    }
  }
};

/**
 * Throws a ValidationError with the given message. This is useful to signal the validation
 * for a node has failed
 */
BaseNode.prototype.throwValidationError = function (message) {
  throw new ValidationError(message);
};

module.exports = BaseNode;
