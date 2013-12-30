
var NodeMap = require('./load-node-map');

function hydrate(obj) {
  // Array
  if (Object.prototype.toString.call(obj) === '[object Array]') {
    return obj.map(hydrate);
  }
  
  // Object
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    var result = ("type" in obj) 
        // obj is an AST node data object
        ? new NodeMap[obj.type](result) 
        // obj is some other generic object
        : {};
    
    // Copy all the hydrated version of the properties from the raw object on to the new object
    for (var key in obj) {
      result[key] = hydrate(obj[key]);
    }
    
    // This is just a generic JS object, return the hydrated version
    return result;
  }
  
  // Primitive
  return obj;
}

module.exports = hydrate;
