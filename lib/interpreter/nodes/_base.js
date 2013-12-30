

function BaseNode() {
}

/**
 * Method that runs in the validation cycle of the interpreter. This method ensures
 * the given AST is valid.
 * 
 * Method should throw an error if any expectations needed by this node are not true.
 */
BaseNode.prototype.validate = function () {
  return true;
}


/**
 * Method that runs in the execution cycle of the interpreter. This method evaluates
 * the current node and performs the necessary action.
 */
BaseNode.prototype.eval = function () {}

/**
 * Iterator to traverse all the children nodes of this node
 * @param {function(node, context)} callback Function to call on each child node
 */
BaseNode.prototype.forEachChild = function (callback) {
}

module.exports = BaseNode;
