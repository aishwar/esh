

var BaseNode = require('./_base');
var util = require('util');
var sh = require('execSync');

function CommandNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(CommandNode, BaseNode);

CommandNode.prototype.evaluate = function(context) {
  var result = sh.exec(this.value);
  var commandFailed = (result.code !== 0) || (result.stderr);
  var failable = (this.directives.indexOf('failable') > -1);

  context.globalScope.command = {
    ok: !commandFailed,
    code: result.code,
    out: result.stdout,
    err: result.stderr
  };

  if (!commandFailed) return;
  if (commandFailed && failable) return;
  
  // commandFailed while it is not failable
  if (this.errorMessage) {
    console.error(this.errorMessage);
    throw new Error(this.errorMessage);
  }
};

module.exports = CommandNode;