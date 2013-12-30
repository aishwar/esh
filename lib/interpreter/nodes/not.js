

var BaseNode = require('./_base');
var util = require('util');

function NotNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(NotNode, BaseNode);

module.exports = NotNode;
