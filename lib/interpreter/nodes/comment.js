

var BaseNode = require('./_base');
var util = require('util');

function CommentNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(CommentNode, BaseNode);

module.exports = CommentNode;
