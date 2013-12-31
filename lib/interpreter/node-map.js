
var nodeTypes = [
  'root',
  'command',
  'special-word',
  'operation',
  'loop',
  'block',
  'if',
  'comparison',
  'not',
  'variable',
  'log:err',
  'log:out',
  'comment',
  'literal:number',
  'literal:string'
];

var NodeMap = {};
nodeTypes.forEach(function (nodeType) {
  // Replace ':' with '_' since filenames cannot contain ':'
  NodeMap[nodeType] = require('./nodes/' + nodeType.replace(':', '_'));
});

module.exports = NodeMap;
