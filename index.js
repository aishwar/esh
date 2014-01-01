
var Interpreter = require('./lib/interpreter');
var parser = require('./lib/parser');
var fs = require('fs');


var program = require('commander');

program
  .version('0.0.1')
  .usage('<esh-file>')
  .parse(process.argv);

intializeRunner();
runProgram(program);

// Helper functions below

function runProgram(program) {
  var inputFile = program.args[0];
  validateInput(inputFile);
  executeFile(inputFile);
}

function executeFile(filename) {
  var sourceStr = fs.readFileSync(filename, 'utf8');
  var rawRootNode = parser.parse(sourceStr);
  var interpreter = new Interpreter(rawRootNode);

  interpreter.run();
}

function validateInput(filename) {
  if (!filename) throw new Error('No input file specified. Exiting now.');
  if (!fs.existsSync(filename)) throw new Error('File not found. Tried looking for: ' + filename);
}

function intializeRunner() {
  process.on('uncaughtException', function (e) {
    console.error(e.message);
    process.exit(1);
  });
}
