

var BaseNode = require('./_base');
var util = require('util');

function ComparisonNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(ComparisonNode, BaseNode);

module.exports = ComparisonNode;
