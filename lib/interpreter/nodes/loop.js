

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
  var list = this.list.evaluate(context);
  var body = this.body;
  var valueProperty = this.valueProperty.name;
  var indexProperty = this.indexProperty.name;

  context.newScope();
  list.forEach(function (item, index) {
    context.currentScope[valueProperty] = item;
    context.currentScope[indexProperty] = index;
    body.forEach(function (node) {
      node.evaluate(context);
    });
  });
  context.endScope();
};

module.exports = LoopNode;
