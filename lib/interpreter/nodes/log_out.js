

var BaseNode = require('./_base');
var util = require('util');
var substituteValues = require('../helpers/substitute-values');

function LogOutNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(LogOutNode, BaseNode);

LogOutNode.prototype.evaluate = function (context) {
  console.log(substituteValues(this.value, context.currentScope));
};

module.exports = LogOutNode;
