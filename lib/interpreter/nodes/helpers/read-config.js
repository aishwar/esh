
/**
 * Module dependencies
 */
var yaml = require('js-yaml');
var fs = require('fs');
var sh = require('execSync');


module.exports = function (file) {
  var raw = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
  return execScripts(raw);
};


function execScripts(obj) {
  for (var key in obj) {
    if (!obj.hasOwnProperty(key) || !obj[key]) continue;
    var value = obj[key];
    
    if (typeof value == 'object') {
      execScripts(value);
    } else 
    if (typeof value == 'string') {
      var quoted$ = /^\$\((?:'([^']*)'|"([^"]*)")\)$/;
      
      if (quoted$.test(value)) {
        var match = quoted$.exec(value);
        var shellCommand = match[1] || match[2];
        var result = sh.exec(shellCommand);
        
        if (result.code) throw new Error('Command "' + shellCommand + '" exited with code ' + result.code);
        if (result.stderr) throw new Error('Command "' + shellCommand + '" printed to stderr: ' + result.stderr);
        // Remove the last newline from the output
        obj[key] = (result.stdout || "").replace(/ ?\r?\n$/, '');
      }
    }
  }
  
  return obj;
}
