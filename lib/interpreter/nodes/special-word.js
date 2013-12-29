

/**
 * Method that runs in the validation cycle of the interpreter. This method ensures
 * the given AST is valid.
 * 
 * Method should throw an error if any expectations needed by this node are not true.
 */
exports.validate = function (node, context) {}


/**
 * Method that runs in the execution cycle of the interpreter. This method evaluates
 * the current node and performs the necessary action.
 */
exports.eval = function (node, context) {}
