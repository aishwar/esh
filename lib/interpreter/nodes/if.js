

var BaseNode = require('./_base');
var util = require('util');

function IfNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(IfNode, BaseNode);

IfNode.prototype.evaluate = function () {
  if (this.condition.evaluate()) {
    this.body.forEach(function (node) {
      node.evaluate();
    });
  } else {
    this.alternate.forEach(function (node) {
      node.evaluate();
    });
  }
};

module.exports = IfNode;
