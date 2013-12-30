
var NodeMap = require('./load-node-map');
var hydrate = require('./hydrate');

function Interpretter(rawRootNode) {
  this.rawRootNode = rawRootNode;
  this.rootNode = hydrate(rawRootNode);
}

module.exports = Interpretter;
