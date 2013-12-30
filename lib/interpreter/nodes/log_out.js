

var BaseNode = require('./_base');
var util = require('util');

function LogOutNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(LogOutNode, BaseNode);

module.exports = LogOutNode;
