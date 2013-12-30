

var BaseNode = require('./_base');
var util = require('util');

function IfNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(IfNode, BaseNode);

module.exports = IfNode;
