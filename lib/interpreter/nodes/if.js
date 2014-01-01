

var BaseNode = require('./_base');
var util = require('util');

function IfNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(IfNode, BaseNode);

IfNode.prototype.evaluate = function (context) {
  if (this.condition.evaluate(context)) {
    this.body.forEach(function (node) {
      node.evaluate(context);
    });
  } else {
    this.alternate.forEach(function (node) {
      node.evaluate(context);
    });
  }
};

module.exports = IfNode;
