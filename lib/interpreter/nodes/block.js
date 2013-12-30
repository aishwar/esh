

var BaseNode = require('./_base');
var util = require('util');

function BlockNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(BlockNode, BaseNode);

module.exports = BlockNode;
