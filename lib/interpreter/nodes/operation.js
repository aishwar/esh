

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
      if (this.input.valueType !== 'string' && this.input.valueType !== 'number')
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
      var number = +this.input.evaluate(context);
      return (isNaN(number)) ? 1 : number;
    case 'lines':
      return this.input.evaluate(context).split('\n');
    case 'glob':
      return glob.sync(this.input.evaluate(context));
    case 'load':
      try {
        context.loadValuesFromFile(this.input.evaluate(context));
      } catch (e) {
        throw new Error('load("' + this.input.evaluate(context) + '") failed with error: ' + e.message);
      }
      return;
  }
};

module.exports = OperationNode;
