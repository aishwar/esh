var parser = require('../../../lib/parser');
var Interpreter = require('../../../lib/interpreter');

/**
 * Returns the AST node for a given source string
 * @param  {string} str Source string
 * @return {object}     AST node representing the object
 */
function node(str) {
  var rawRootNode = parser.parse(str);
  var interpreter = new Interpreter(rawRootNode);
  var outputNode = interpreter.rootNode.body[0];
  return outputNode;
}

module.exports = node;
