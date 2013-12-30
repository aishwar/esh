

var BaseNode = require('./_base');
var util = require('util');

function VariableNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(VariableNode, BaseNode);

module.exports = VariableNode;
