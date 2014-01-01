

var BaseNode = require('./_base');
var util = require('util');

function BlockNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(BlockNode, BaseNode);

BlockNode.prototype.validateSelf = function () {
  if (this.name !== 'Usage') return true;

  // Usage block has special rules
  this.body.forEach(function (node) {
    if (node.type !== 'literal:string')
      this.throwValidationError('Usage block cannot contain non-string expressions');
  });

  return true;
};

BlockNode.prototype.evaluate = function (context) {
  if (this.name !== 'Usage') {
    this.body.forEach(function (node) {
      node.evaluate(context);
    });
  }
};

module.exports = BlockNode;
