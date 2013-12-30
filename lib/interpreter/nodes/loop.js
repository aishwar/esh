

var BaseNode = require('./_base');
var util = require('util');

function LoopNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(LoopNode, BaseNode);

module.exports = LoopNode;
