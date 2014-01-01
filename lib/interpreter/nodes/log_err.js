

var BaseNode = require('./_base');
var util = require('util');
var substituteValues = require('../helpers/substitute-values');

function LogErrNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(LogErrNode, BaseNode);

LogErrNode.prototype.evaluate = function (context) {
  console.error(substituteValues(this.value, context.currentScope));
};

module.exports = LogErrNode;
