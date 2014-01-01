

var BaseNode = require('./_base');
var util = require('util');

function LogOutNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(LogOutNode, BaseNode);

LogOutNode.prototype.evaluate = function (context) {
  console.log(this.value);
};

module.exports = LogOutNode;
