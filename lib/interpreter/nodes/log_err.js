

var BaseNode = require('./_base');
var util = require('util');

function LogErrNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(LogErrNode, BaseNode);

module.exports = LogErrNode;
