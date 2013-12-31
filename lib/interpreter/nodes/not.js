

var BaseNode = require('./_base');
var util = require('util');

function NotNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(NotNode, BaseNode);

NotNode.prototype.validateSelf = function () {
  return (this.value.valueType === 'string') || (this.value.valueType === 'number');
};

NotNode.prototype.evaluate = function () {
  return !!this.value;
};

module.exports = NotNode;
