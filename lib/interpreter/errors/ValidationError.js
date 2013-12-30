
var util = require('util');

function ValidationError(message) {
  this.name = this.constructor.name;
  this.message = message;
}

util.inherits(ValidationError, Error);

module.exports = ValidationError;
