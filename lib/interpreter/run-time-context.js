
var readConfig = require('./helpers/read-config');

function RuntimeContext() {
  this.globalScope = {};
}

RuntimeContext.prototype.loadValuesFromFile = function (path) {
  var props = readConfig(path);
  for (var key in props) {
    this.globalScope[key] = props[key];
  }
};

module.exports = RuntimeContext;
