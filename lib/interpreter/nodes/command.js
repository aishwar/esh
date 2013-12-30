

var BaseNode = require('./_base');
var util = require('util');

function CommandNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(CommandNode, BaseNode);

module.exports = CommandNode;