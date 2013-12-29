

/**
 * Method that runs in the validation cycle of the interpreter. This method ensures
 * the given AST is valid.
 * 
 * Method should throw an error if any expectations needed by this node are not true.
 */
exports.validate = function (node, context) {
  switch (node.name) {
    case 'Usage':
      node.body.forEach(function (node) {
        if (node.valueType !== 'string')
          throw new Error('Usage block should contain only strings. Non-string token found at ' + 
            node.position.toString());
      });
      break;
    default:
      return true;
  }
}


/**
 * Method that runs in the execution cycle of the interpreter. This method evaluates
 * the current node and performs the necessary action.
 */
exports.eval = function (node, context) {}
