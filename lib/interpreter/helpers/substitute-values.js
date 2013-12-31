
/**
 * Given a command and the root object, replaces $<var> in the command with the respective
 * values extracted from the rootObject. If the value does not exist in the rootObject, the
 * original $<var> text is left as is.
 */
module.exports = function (command, rootObj) {
  var $regex = /\$([^\s]+)/g;
  return command.replace($regex, function (match, path) {
    var value = resolve(rootObj, path);
    if (value !== undefined) return value;
    else return match;
  });
}

function resolve(obj, path) {
  var parts = path.split('.');
  
  parts.forEach(function (part) {
    if (!obj) return;
    obj = obj[part];
  });
  
  return obj;
}
