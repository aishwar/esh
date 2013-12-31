

var BaseNode = require('./_base');
var util = require('util');

function LiteralStringNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(LiteralStringNode, BaseNode);

LiteralStringNode.prototype.evaluate = function () {
  return this.value;
};

module.exports = LiteralStringNode;
