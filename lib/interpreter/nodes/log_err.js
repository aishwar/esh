

var BaseNode = require('./_base');
var util = require('util');

function LogErrNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(LogErrNode, BaseNode);

LogErrNode.prototype.evaluate = function (context) {
  console.error(this.value);
};

module.exports = LogErrNode;
