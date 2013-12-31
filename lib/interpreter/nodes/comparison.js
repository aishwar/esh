

var BaseNode = require('./_base');
var util = require('util');

function ComparisonNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(ComparisonNode, BaseNode);

ComparisonNode.prototype.validateSelf = function () {
  if (this.left.valueType !== this.right.valueType) {
    this.throwValidationError('Left (' + this.left.valueType +
      ') and Right (' + this.right.valueType +
      ') sides of comparison are incompatible.');
  }
};

ComparisonNode.prototype.evaluate = function () {
  var left = this.left.evaluate();
  var right = this.right.evaluate();

  switch (this.operator) {
    case '>=':
      return left >= right;
    case '>' :
      return left > right;
    case '<=':
      return left <= right;
    case '<' :
      return left < right;
    case '!=':
      return left != right;
    case '==' :
      return left == right;
  }

  return false;
};

module.exports = ComparisonNode;
