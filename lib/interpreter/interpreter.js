
var NodeMap = require('./load-node-map');

function Interpretter(nodes) {
  this.nodes = nodes;
}

Interpretter.prototype.forEachNode = function (callback) {
  (this.nodes || []).forEach(callback);
}

// Ensures the given AST is valid
Interpretter.prototype.validate = function () {
  // Verify top levle nodes are valid
  this.forEachNode(function (node) {
    if (!node || !node.type || !NodeMap[node.type]) {
      throw new Error('Invalid AST node encountered');
    }
  });
  
  // Ensure all nodes are valid
  var validationContext = {};
  this.forEachNode(function (node) {
    node.validate(validationContext);
  });
}

// Executes the given AST
Interpretter.prototype.execute = function () {
  // Validate the AST before executing it
  this.validate();
  
  // Execute the AST
  var runtimeContext = {};
  this.forEachNode(function (node) {
    node.eval(runtimeContext);
  });
}

module.exports = Interpretter;