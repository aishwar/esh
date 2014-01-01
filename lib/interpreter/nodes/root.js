

var BaseNode = require('./_base');
var util = require('util');

function RootNode() {
  BaseNode.apply(this, arguments);
}

util.inherits(RootNode, BaseNode);

RootNode.prototype.forEachChild = function (callback) {
  this.body.forEach(callback);
};

RootNode.prototype.validateSelf = function () {
  // Validation Rules:
  // 1. There can be any number of load statements
  // 2. Followed by blocks (only 1 block of each kind is allowed - Usage, Main, OnError, CleanUp)
  
  var loadComplete = false;
  var allowedBlocks = {
    'Usage': true,
    'Main': true,
    'OnError': true,
    'CleanUp': true
  };
  
  for (var i = 0; i < this.body.length; i++) {
    var instruction = this.body[i];
    
    // Non-load operations not allowed
    if (instruction.type === 'operation' && instruction.name !== 'load') {
      this.throwValidationError('Non-load operations cannot be done at the root level');
      return;
    }
    
    // If loadComplete, operations are no longer allowed
    if (loadComplete && instruction.type === 'operation') {
      this.throwValidationError('No more load operations can be done at the root level. ' +
        'Other blocks have come before this.');
      return;
    }
    
    // Block operations are allowed conditionally
    if (instruction.type === 'block') {
      // Make sure this is allowed
      if (!allowedBlocks[instruction.name]) {
        this.throwValidationError(instruction.name + ' block not allowed here. This block already' +
          'exists');
        return;
      }
      
      // This is an allowed block; now mark it as no longer allowed
      allowedBlocks[instruction.name] = false;
      loadComplete = true;
    }

    if (instruction.type === 'comment') continue;
    if (['comment', 'block', 'operation'].indexOf(instruction.type) === -1) {
      this.throwValidationError(instruction.type + ' encountered. Only blocks, comments and load ' +
        'operations are allowed at the root of the file.');
    }
  }
};

RootNode.prototype.evaluate = function (context) {
  var blocks = {};

  // Perform any load operations first
  this.body.forEach(function (node) {
    if (node.type === 'operation' && node.name === 'load') {
      return node.evaluate(context);
    }
    blocks[node.name] = node;
  });

  // Execute the blocks after the load operations
  try {
    blocks.Main.evaluate(context);
  } catch (e) {
    if (blocks.OnError) blocks.OnError.evaluate(context);
  } finally {
    if (blocks.CleanUp) blocks.CleanUp.evaluate(context);
  }
};

module.exports = RootNode;
