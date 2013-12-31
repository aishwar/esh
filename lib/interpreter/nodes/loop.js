

var BaseNode = require('./_base');
var util = require('util');

function LoopNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(LoopNode, BaseNode);

LoopNode.prototype.validateSelf = function () {
  if (this.list.valueType !== 'array') {
    this.throwValidationError('Target to loop over is not a list.');
  }
};

LoopNode.prototype.evaluate = function (context) {
  var list = this.list.evaluate();
  var body = this.body;

  context.newScope();
  list.forEach(function (item, index) {
    context.currentScope[this.valueProperty.name] = item;
    context.currentScope[this.indexProperty.name] = index;
    body.forEach(function (node) {
      node.evaluate();
    });
  });
  context.endScope();
};

module.exports = LoopNode;
