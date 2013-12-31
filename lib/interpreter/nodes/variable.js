

var BaseNode = require('./_base');
var util = require('util');

function VariableNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(VariableNode, BaseNode);

VariableNode.prototype.evaluate = function (context) {
  return resolve(context.currentScope, this.value) || ('$' + this.value);
};

module.exports = VariableNode;

function resolve(obj, path) {
  var parts = path.split('.');
  
  parts.forEach(function (part) {
    if (!obj) return;
    obj = obj[part];
  });
  
  return obj;
}
