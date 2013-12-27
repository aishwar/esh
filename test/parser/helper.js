

function organize(obj) {
  var keys = Object.keys(obj).sort();
  var result = {};
  var key, value;
  
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    value = obj[key];
    
    // If value is an object, organize it as well
    if (Object.prototype.toString.call(value) === '[object Object]') {
      result[key] = organize(value);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}


function print(obj) {
  return JSON.stringify(organize(obj), null, 2);
}


exports.organize = organize;
exports.print = print;