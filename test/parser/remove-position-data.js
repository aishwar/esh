
var assert = require('assert');

// Positions can change. Adding correct positions can make the test difficult to maintain.
// This function removes the position data from the nodes to make comparison between
// expectation and the object easier
function removePositionData(obj) {
  if (Object.prototype.toString.call(obj) === '[object Array]') {
    obj.forEach(removePositionData);
  } else if (Object.prototype.toString.call(obj) === '[object Object]') {
    // If this is an AST node
    if ("type" in obj) {
      // Verify existence of the position properties. We don't verify the correctness 
      // of the positions here. 'position' is provided by the PEG.js parser and assumed 
      // correct.
      assert.ok(obj.position && obj.position.line, 
        '"position.line" missing for AST node of type: ' + obj.type);
      assert.ok(obj.position && obj.position.column, 
        '"position.column" missing in AST node of type: ' +  + obj.type);
      // Remove the position property as promised by the name of the function
      delete obj.position;
    }
    
    // Remove the positions from all properties of this node
    for (var key in obj) {
      removePositionData(obj[key]);
    }
  }
}

module.exports = removePositionData;
