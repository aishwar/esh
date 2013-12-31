

var BaseNode = require('./_base');
var util = require('util');

function LiteralNumberNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(LiteralNumberNode, BaseNode);

LiteralNumberNode.prototype.evaluate = function () {
  return this.value;
};

module.exports = LiteralNumberNode;
