

var BaseNode = require('./_base');
var util = require('util');
var sh = require('execSync');
var substituteValues = require('../helpers/substitute-values');

function CommandNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(CommandNode, BaseNode);

CommandNode.prototype.evaluate = function(context) {
  var command = substituteValues(this.value, context.currentScope);
  var result = sh.exec(command);
  var commandFailed = (result.code !== 0) || (result.stderr);
  var failable = (this.directives.indexOf('failable') > -1);
  var errorMessage = this.errorMessage || 'Program terminated due to the command failing.';

  if (result.stdout) console.log(result.stdout);
  if (result.stderr) console.error(result.stderr);

  context.globalScope.command = {
    ok: !commandFailed,
    code: result.code,
    out: result.stdout,
    err: result.stderr
  };

  if (!commandFailed) return;
  if (commandFailed && failable) return;
  
  // commandFailed while it is not failable
  throw new Error(errorMessage);
};

module.exports = CommandNode;