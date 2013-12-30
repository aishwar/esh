
var assert = require('assert');

function type(obj) {
  return Object.prototype.toString.call(obj);
}

function isArray(obj) {
  return type(obj) == '[object Array]';
}

function isObject(obj) {
  return type(obj) == '[object Object]';
}

function isPrimitive(obj) {
  return !obj || typeof obj != "object";
}

function organize(obj) {
  if (isPrimitive(obj)) return obj;
  if (isArray(obj)) return obj.map(organize);
  
  // Else this is an object
  var keys = Object.keys(obj).sort();
  var result = {};
  var key, value;
  
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    value = obj[key];
    result[key] = organize(value);
  }
  
  return result;
}


function print(obj) {
  return JSON.stringify(organize(obj), null, 2);
}



exports.organize = organize;
exports.print = print;
