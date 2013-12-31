

var BaseNode = require('./_base');
var util = require('util');
var glob = require('glob');

function OperationNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(OperationNode, BaseNode);

OperationNode.prototype.validateSelf = function () {
  switch (this.name) {
    case 'number':
      if (this.input.valueType !== 'string' || this.input.valueType !== 'number')
        this.throwValidationError('number opration takes in an input of either string or number, receieved: ' +
          this.input.valueType);
      break;
    case 'lines':
    case 'glob':
    case 'load':
      if (this.input.valueType !== 'string')
        this.throwValidationError('lines opration takes in an input of type number, receieved: ' +
          this.input.valueType);
      break;
  }
};

OperationNode.prototype.evaluate = function (context) {
  switch (this.name) {
    case 'number':
      var number = +this.value;
      return (isNaN(number)) ? 1 : number;
    case 'lines':
      return this.value.split('\n');
    case 'glob':
      return glob.sync(this.value);
    case 'load':
      context.loadValuesFromFile(this.value);
      return;
  }
};

module.exports = OperationNode;
