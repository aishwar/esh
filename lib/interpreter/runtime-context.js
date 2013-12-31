
var readConfig = require('./helpers/read-config');

function RuntimeContext() {
  this.globalScope = {};
  this.currentScope = this.globalScope;
}

RuntimeContext.prototype.retrieveValue = function (path) {
  return resolve(this.currentScope, path);
};

RuntimeContext.prototype.retrieveGlobalValue = function (path) {
  return resolve(this.globalScope, path);
};

RuntimeContext.prototype.loadValuesFromFile = function (path) {
  var props = readConfig(path);
  for (var key in props) {
    this.globalScope[key] = props[key];
  }
};

RuntimeContext.prototype.newScope = function () {
  var scope = {};
  scope.__proto__ = this.currentScope;
  this.currentScope = scope;
};

RuntimeContext.prototype.endScope = function () {
  if (this.currentScope === this.globalScope) {
    throw new Error('Internal error: tried to end global scope!');
  }

  this.currentScope = this.currentScope.__proto__;
};

module.exports = RuntimeContext;

function resolve(obj, path) {
  var parts = path.split('.');
  
  parts.forEach(function (part) {
    if (!obj) return;
    obj = obj[part];
  });
  
  return obj;
}
