

var BaseNode = require('./_base');
var util = require('util');

function SpecialWordNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(SpecialWordNode, BaseNode);

module.exports = SpecialWordNode;