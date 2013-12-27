var assert = require('assert');
var parser = require('../../lib/parser');
var helper = require('./helper');

describe('Parser', function () {

  function test(nodeType, testCases) {
    // testCases is a list, where each item is of the format:
    //   [ input, output, test-description ]
    testCases.forEach(function (detail) {
        var input = detail[0],
            description = detail[2],
            output,
            expected;
        
        // When a simple type is passed as the expected value, the node is expected to contain
        // a property called "value" with the expected value
        if (typeof detail[1] != "object") {
          expected = {
            type: nodeType,
            value: detail[1]
          }
        } else {
          // When an object is passed as the expected value, it is assumed this is the whole
          // object, except the "type" may not be filled as it repeats.
          expected = detail[1];
          expected.type = nodeType;
        }
        
        try {
          output = parser.parse(input)
        } catch (e) {
          if (e instanceof parser.SyntaxError) {
            throw new Error('Parser: Syntax error in input:\n\tInput:' + input + '\n\tError:' + e.message +
              '\n\tError at line ' + e.line + ', column ' + e.column);
          }
        }
        
        if (description) {
          description += '.\n' +
            'Expected: ' + helper.print(expected) + '\n' +
            'Actual: ' + helper.print(output) + '\n';
        }
        // Do the deep equal, because I like to see the diff between the nodes
        assert.deepEqual(output, expected, description);
        // Ensure types are what we expect as well
        if (expected.value !== output.value) {
          throw new Error('Type error in value. Expected: ' + JSON.stringify(expected) + ', Received: ' + JSON.stringify(output));
        }
    });
  }

  it ('should parse strings', function () {
    test('literal:string', [
      [ "''", '', 'Single quoted empty string' ],
      [ '""', '', 'Double quoted empty string' ],
      [ "'hello'", 'hello', 'Single quoted string' ],
      [ '"hello"', 'hello', 'Double quoted string' ],
      [ '"\\"hello\\""', '"hello"', 'Single quoted string with escape sequence' ],
      [ "'\\'hello\\''", "'hello'", 'Double quoted string with escape sequence' ],
      [ '"' + "m'i'xed" + '"', "m'i'xed", 'Single quotes within double quoted string' ],
      [ "'" + 'm"i"xed' + "'", 'm"i"xed', 'Double quotes within single quoted string' ]
    ]);
  });
  
  it ('should parse numbers', function () {
    test('literal:number', [
      [ '1', 1, 'Integer number parsing'],
      [ '035', 35, 'Number should not be parsed as octal by leading 0']
    ]);
  });
  
  it ('should parse comments', function () {
    test('comment', [
      [ '# comment', ' comment', '']
    ]);
  });
  
  it ('should parse log messages', function () {
    test('log:out', [
      [ '## log', 'log', '']
    ]);
  });
  
  it ('should parse log-err messages', function () {
    test('log:err', [
      [ '#! error', 'error', '']
    ]);
  });
  
  it ('should parse variables', function () {
    test('variable', [
      [ '$var', 'var', 'Name with only letters'],
      [ '$vv1', 'vv1', 'Name with letters and numbers'],
      [ '$v.i', 'v.i', 'Name with dots (used when reading nested values)']
    ]);
  });
  
  it ('should parse whitespace', function () {
    test('whitespace', [
      [ ' ', ' ', 'Single Space'],
      [ '   ', '   ', 'Multiple Spaces'],
      [ '\n \n', '\n \n', 'Newline'],
      [ '\r \r', '\r \r', 'Carriage Returns'],
      [ ' \t \t ', ' \t \t ', 'Tabs']
    ]);
  });
  
  function atom(type, val) {
    return {
      type: type,
      value: val
    }
  }
  
  it ('should parse if-statements', function () {
    
    test('if', [
      [ 'if ($a) {} ', {condition: atom('variable', 'a'), body: []}, 'Variable used as a condition' ],
      [ 'if (!$a) {} ', {condition: atom('not', atom('variable', 'a')), body: []},
        'Variable used as a condition' ],
      [ ' if  ( $a )  { \n\t }  ', {condition: atom('variable', 'a'), body: []},
        'whitespace before/after if; before/after condition; multiple whitespaces' ],
      [ ' if ( $a  >=  5 ) {}', {
        condition: {
          type: 'comparison',
          left: atom('variable', 'a'),
          right: atom('literal:number', 5),
          operator: atom('operator', '>=')
        },
        body: [],
      }, 'Comparison used as a condition' ],
    ]);
    
  
  
    describe('  Comparisons in if-statements', function () {
      it ('should be parsed', function () {
        test('if', [
          [ 'if ($a > 1) {}',
            {
              condition: {
                type: 'comparison',
                operator: atom('operator', '>'),
                left: atom('variable', 'a'),
                right: atom('literal:number', 1)
              },
              body: []
            },
            '<variable> <operator> <number> : greater than' ],
          
          [ 'if ($a < 1) {}',
            {
              condition: {
                type: 'comparison',
                operator: atom('operator', '<'),
                left: atom('variable', 'a'),
                right: atom('literal:number', 1)
              },
              body: []
            },
            '<variable> <operator> <number> : greater than' ],
          
          [ 'if ($a >= 1) {}',
            {
              condition: {
                type: 'comparison',
                operator: atom('operator', '>='),
                left: atom('variable', 'a'),
                right: atom('literal:number', 1)
              },
              body: []
            },
            '<variable> <operator> <number> : greater than' ],
            
          [ 'if ($a <= 1) {}', 
            {
              condition: {
                type: 'comparison',
                operator: atom('operator', '<='),
                left: atom('variable', 'a'),
                right: atom('literal:number', 1)
              },
              body: []
            },
            '<variable> <operator> <number> : not equal to' ],
          
          [ 'if (1\t==\t\t1) {}',
            {
              condition: {
                type: 'comparison',
                operator: atom('operator', '=='),
                left: atom('literal:number', 1),
                right: atom('literal:number', 1)
              },
              body: []
            },
            '<number> <whitespace> <operator> <whitespace> <number> : equal to' ],
            
          [ 'if ($command.err != "") {}',
            {
              condition: {
                type: 'comparison',
                operator: atom('operator', '!='),
                left: atom('variable', 'command.err'),
                right: atom('literal:string', "")
              },
              body: []
            },
            '<nested.variable> <operator> <string> : not equal to' ],
            
          [ 'if (\t\t"done" == $command.out) {}',
            {
              condition: {
                type: 'comparison',
                operator: atom('operator', '=='),
                left: atom('literal:string', 'done'),
                right: atom('variable', 'command.out')
              },
              body: []
            },
            '[start-of-line-whitespace] <string> <operator> <nested.variable> : equal to' ],
            
          [ 'if (\t\t"done" == $command.out\t\t\t\n) {}',
            {
              condition: {
                type: 'comparison',
                operator: atom('operator', '=='),
                left: atom('literal:string', 'done'),
                right: atom('variable', 'command.out')
              },
              body: []
            },
            '<string> <operator> <nested.variable> [end-of-line-whitespace] : equal to' ]
        ]);
      });
    });
    
    
    describe('  Body in if-statement', function () {
      it ('should be parsed', function () {
        test('if', [
          [ 'if ($a) {\n\t## This is great\n}', {
            condition: atom('variable', 'a'),
            body: [
              atom('log:out', 'This is great')
            ]
          }, 'Log statement in body'],
          
          
          [ 'if ($a) {\n' +
            '  ## This is great\n' +
            '  #! This is an error\n' +
            '}', {
            condition: atom('variable', 'a'),
            body: [
              atom('log:out', 'This is great'),
              atom('log:err', 'This is an error')
            ]
          }, 'Multiple statements in body (out and err)'],
          
          
          [ 'if ($a) {\n' +
            '  ## This is great\n' +
            '  if ($b) {\n' + 
            '    ## abc\n' +
            '  }\n' +
            '}', {
            condition: atom('variable', 'a'),
            body: [
              atom('log:out', 'This is great'),
              {
                type: 'if',
                condition: atom('variable', 'b'),
                body: [
                  atom('log:out', 'abc')
                ]
              }
            ]
          }, 'Nested if-statement in body']
        ]);
      });
    });
    
    
    describe('  Body in else block of if-statement', function () {
      it ('should be parsed', function () {
        test('if', [
          [ 'if ($a) {} else {}', {
            condition: atom('variable', 'a'),
            alternate: [],
            body: []
          }, 'Log statement in body'],
          
          
          [ 'if ($a) {} else {\n' +
            '  ## This is great\n' +
            '  #! This is an error\n' +
            '}', {
            condition: atom('variable', 'a'),
            alternate: [
              atom('log:out', 'This is great'),
              atom('log:err', 'This is an error')
            ],
            body: []
          }, 'Multiple statements in body (out and err)'],
          
          
          [ 'if ($a) {\n\t\n} else {\n' +
            '  ## This is great\n' +
            '  if ($b) {\n' + 
            '    ## abc\n' +
            '  }\n' +
            '}', {
            condition: atom('variable', 'a'),
            alternate: [
              atom('log:out', 'This is great'),
              {
                type: 'if',
                condition: atom('variable', 'b'),
                body: [
                  atom('log:out', 'abc')
                ]
              }
            ],
            body: []
          }, 'Nested if-statement in body']
        ]);
      });
    });
  });
    
    
  it ('should parse blocks', function () {
    test('block', [
      [ 'OnError {\n' +
        '  #! Error occurred!\n' +
        '  #! Exiting.\n' +
        '}',
        {
          name: 'OnError',
          body: [
            atom('log:err', 'Error occurred!'),
            atom('log:err', 'Exiting.')
          ]
        },
        'OnError block'
      ],
      
      [ 'CleanUp {\n' +
        '  ## Cleaning up\n' +
        '  if ($a) {}\n' +
        '}',
        {
          name: 'CleanUp',
          body: [
            atom('log:out', 'Cleaning up'),
            {
              type: 'if',
              condition: atom('variable', 'a'),
              body: []
            }
          ]
        },
        'CleanUp block with an if statement inside'
      ],
      
      [ 'Usage {\n' +
        '  "-f --file <filename>: Input file"\n' +
        "  'Here is some text in single quotes'\n" +
        '}',
        {
          name: 'Usage',
          body: [
            atom('literal:string', '-f --file <filename>: Input file'),
            atom('literal:string', 'Here is some text in single quotes')
          ]
        },
        'Usage block with strings inside'
      ]
    ])
  });
  
  it ('should parse operations', function () {
    test('operation', [
    
      // Test all valid token combinations of "number" inputs
      [ 'number("abc")', {
        name: 'number',
        input: atom('literal:string', 'abc')
      }, 'number(<string-literal>)'],
      
      [ 'number($command.out)', {
        name: 'number',
        input: atom('variable', 'command.out')
      }, 'number(<variable>)'],
      
      [ 'number(12)', {
        name: 'number',
        input: atom('literal:number', 12)
      }, 'number(<number-literal>)'],
      
      // Test all valid token combinations of "lines" inputs
      [ 'lines("abc")', {
        name: 'lines',
        input: atom('literal:string', 'abc')
      }, 'lines(<string-literal>)'],
      
      [ 'lines($command.out)', {
        name: 'lines',
        input: atom('variable', 'command.out')
      }, 'lines(<variable>)'],
      
      // Test all valid token combinations of "glob" inputs
      [ 'glob("abc")', {
        name: 'glob',
        input: atom('literal:string', 'abc')
      }, 'glob(<string-literal>)'],
      
      [ 'glob($command.out)', {
        name: 'glob',
        input: atom('variable', 'command.out')
      }, 'glob(<variable>)'],
      
      // Test whitespace in between operation tokens
      [ 'number  (\t"abc"\t )', {
        name: 'number',
        input: atom('literal:string', 'abc')
      }, 'whitespaces after operation-name, after opening paranthesis, before closing paranthesis']
    ]);
  });
  
  it ('should parse special words', function () {
    test('special-word', [
      [ 'exit:bad', { name: 'exit:bad' }, 'Bad exit'],
      [ 'exit:ok', { name: 'exit:ok' }, 'Good exit']
    ]);
  });
  
  it ('should parse commands', function () {
    test('command', [
      // Basic commands
      [ 'ls', 'ls', 'Command with no args'],
      [ 'mv abc def', 'mv abc def', 'Command with args'],
      [ 'mkdir "abc\\"def"', 'mkdir "abc\\"def"', 'Escaped sequences in strings in command'],
      [ 'cd "my folder"', 'cd "my folder"', 'Double quoted string in command'],
      [ "cd 'my folder'", "cd 'my folder'", 'Single quoted string in command'],
      [ "mv 'my folder' \"another folder\"", "mv 'my folder' \"another folder\"", 
        'Multiple quoted strings in command']
    ]);
  });
});
