

var BaseNode = require('./_base');
var util = require('util');

function RootNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(RootNode, BaseNode);

module.exports = RootNode;