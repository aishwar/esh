

var BaseNode = require('./_base');
var util = require('util');

function OperationNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(OperationNode, BaseNode);

module.exports = OperationNode;
