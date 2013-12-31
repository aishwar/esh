

var BaseNode = require('./_base');
var util = require('util');

function SpecialWordNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(SpecialWordNode, BaseNode);

SpecialWordNode.prototype.evaluate = function () {
  process.exit((this.name === 'exit:bad') ? 1 : 0);
};

module.exports = SpecialWordNode;