require('colors');
var assert = require('assert');
var parser = require('../../lib/parser');
var diffString = require('json-diff').diffString;
var removePositionData = require('./remove-position-data');
var atom = require('../atom');

describe('Parser', function () {

  function test(nodeType, testCases) {
    // testCases is a list, where each item is of the format:
    //   [ input, output, test-description ]
    testCases.forEach(function (detail) {
        var input = detail[0],
            value = detail[1],
            description = detail[2],
            run = detail[3] ? it.only : it,
            output,
            expected;
        
      run (description, function () {
        var failureMessage = '';
        
        // For simple types, make an atom from the node type and value
        if (typeof value != 'object') {
          expected = atom(nodeType, value);
        } else {
          // When an object is passed as the expected value, it is assumed this is the whole
          // object, except the "type" may not be filled as it repeats.
          expected = value;
          expected.type = nodeType;
        }
        
        // "parse" outputs a list where item in the list represents an instruction. These tests
        // test only 1 instruction; so we wrap the expected object in a list; thus creating a 
        // list of 1 item
        expected = [ expected ];
        
        try {
          output = parser.parse(input);
          removePositionData(output);
        } catch (e) {
          if (e instanceof parser.SyntaxError) {
            e.message = 'Parser: Syntax error in input:\n\tInput:' + input + '\n\tError:' + 
              e.message + '\n\tError at line ' + e.line + ', column ' + e.column
          }
          throw e;
        }
        
        // Prepare the failure message in case it has to be printed
        failureMessage = 'Here is the difference from the expected results:\n'.white + 
          diffString(expected, output);
        
        // Do the deep equal, because I like to see the diff between the nodes
        assert.deepEqual(output, expected, failureMessage);
      });
    });
  }
  
  //***************
  // Begin tests! *
  //***************

  describe ('should parse strings:', function () {
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
  
  describe ('should parse numbers:', function () {
    test('literal:number', [
      [ '1', 1, 'Integer number parsing'],
      [ '035', 35, 'Number should not be parsed as octal by leading 0']
    ]);
  });
  
  describe ('should parse comments:', function () {
    test('comment', [
      [ '# comment', ' comment', '']
    ]);
  });
  
  describe ('should parse log messages:', function () {
    test('log:out', [
      [ '## log', 'log', '']
    ]);
  });
  
  describe ('should parse log-err messages:', function () {
    test('log:err', [
      [ '#! error', 'error', '']
    ]);
  });
  
  describe ('should parse variables:', function () {
    test('variable', [
      [ '$var', 'var', 'Name with only letters'],
      [ '$vv1', 'vv1', 'Name with letters and numbers'],
      [ '$v.i', 'v.i', 'Name with dots (used when reading nested values)']
    ]);
  });
  
  describe ('should parse if-statements:', function () {
    
    test('if', [
      [ 'if ($a) {} ', {condition: atom('variable', 'a'), body: []}, 'Variable used as a condition'],
      [ 'if (!$a) {} ', {condition: atom('not', atom('variable', 'a')), body: []},
        'Negated variable used as a condition' ],
      
      [ '\n\nif\n(\n$a\n)\n{\n}\n', {condition: atom('variable', 'a'), body: []},
        'line starting with a closing brace IS NOT A command' ],
      
      [ ' if  ( $a ) \n { \n\t }\n', {condition: atom('variable', 'a'), body: []},
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
    
  });
  
  describe('should parse comparisons in if-statements:', function () {
    
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
    
  describe('should parse body in if-statement:', function () {
    
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
      }, 'Nested if-statement in body'],
      
       [ 'if ($a) {\n\tcat test\n}', {
        condition: atom('variable', 'a'),
        body: [
          atom('command', 'cat test')
        ]
      }, 'command in body'],
    ]);
  });
    
    
  describe('should parse body in else block of if-statement:', function () {
    test('if', [
      [ 'if ($a) {} else {}', {
        condition: atom('variable', 'a'),
        alternate: [],
        body: []
      }, 'Empty else block'],
      
      
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
    
    
  describe ('should parse blocks:', function () {
    test('block', [
      [ 'OnError {}',
        {
          name: 'OnError',
          body: []
        },
        'Block with no content'
      ],
      
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
      ],
      
      [ 'Main {}',
        {
          name: 'Main',
          body: []
        },
        'Main block'
      ]
    ])
  });
  
  describe ('should parse operations:', function () {
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
      
      // Test all valid token combinations of "load" inputs
      [ 'load("abc")', {
        name: 'load',
        input: atom('literal:string', 'abc')
      }, 'load(<string-literal>)'],
      
      [ 'load($command.out)', {
        name: 'load',
        input: atom('variable', 'command.out')
      }, 'load(<variable>)'],
      
      // Test whitespace in between operation tokens
      [ 'number  (\t"abc"\t )', {
        name: 'number',
        input: atom('literal:string', 'abc')
      }, 'whitespaces after operation-name, after opening paranthesis, before closing paranthesis']
    ]);
  });
  
  describe ('should parse loops:', function () {
    test('loop', [
    
      // Common inputs
      
      [ 'loop ($deploy.servers : $server, $idx) {}',
        {
          list: {
            type: 'variable',
            value: 'deploy.servers'
          },
          valueProperty: atom('variable', 'server'),
          indexProperty: atom('variable', 'idx'),
          body: []
        },
        'Loop over variable; retrieve value and index in each iteration'],
        
      [ 'loop (lines($command.out) : $filename, $idx) {}',
        {
          list: {
            type: 'operation',
            name: 'lines',
            input: atom('variable', 'command.out')
          },
          valueProperty: atom('variable', 'filename'),
          indexProperty: atom('variable', 'idx'),
          body: []
        },
        'Loop over results of the lines operation; retrieve value and index in each iteration'],
      
      [ 'loop (glob("/*") : $filename, $index) {}',
        {
          list: {
            type: 'operation',
            name: 'glob',
            input: atom('literal:string', '/*')
          },
          valueProperty: atom('variable', 'filename'),
          indexProperty: atom('variable', 'index'),
          body: []
        },
        'Loop over results of the glob operation; retrieve value and index in each iteration'],
      
      // Loop body
      [ 'loop (glob("/*") : $filename, $idx) {\n' +
        '  # Printing $filename\n' +
        '  ## file: $filename\n' +
        '  mv $filename "renamed-$filename"\n' +
        '}',
        {
          list: {
            type: 'operation',
            name: 'glob',
            input: atom('literal:string', '/*')
          },
          valueProperty: atom('variable', 'filename'),
          indexProperty: atom('variable', 'idx'),
          body: [
            atom('comment', ' Printing $filename'),
            atom('log:out', 'file: $filename'),
            atom('command', 'mv $filename "renamed-$filename"')
          ]
        },
        'Loop with body containing a set of statements'],
        
      // Loop body with whitespaces
      [ '\tloop\t\n(glob("/*") \t : \t $filename,\t\t $index \t)\t\n{\n' +
        '\t  # Printing $filename\n' +
        '\t  ## file: $filename\n' +
        '\t  mv $filename "renamed-$filename"\n' +
        '\t}\t\n',
        {
          list: {
            type: 'operation',
            name: 'glob',
            input: atom('literal:string', '/*')
          },
          valueProperty: atom('variable', 'filename'),
          indexProperty: atom('variable', 'index'),
          body: [
            atom('comment', ' Printing $filename'),
            atom('log:out', 'file: $filename'),
            atom('command', 'mv $filename "renamed-$filename"')
          ]
        },
        'Loop with whitespace before/after every part of the loop'],
    ]);
  });
  
  describe ('should parse special words:', function () {
    test('special-word', [
      [ 'exit:bad', { name: 'exit:bad' }, 'Bad exit'],
      [ 'exit:ok', { name: 'exit:ok' }, 'Good exit']
    ]);
  });
  
  describe ('should parse commands:', function () {
  
    describe ('basic commands', function () {
      test('command', [
        [ 'ls', 'ls', 'Command with no args'],
        [ 'mv abc def', 'mv abc def', 'Command with args'],
        [ 'mkdir "abc\\"def"', 'mkdir "abc\\"def"', 'Escaped sequences in strings in command'],
        [ 'cd "my folder"', 'cd "my folder"', 'Double quoted string in command'],
        [ "cd 'my folder'", "cd 'my folder'", 'Single quoted string in command'],
        [ "mv 'my folder' \"another folder\"", "mv 'my folder' \"another folder\"", 
          'Multiple quoted strings in command']
      ]);
    });
    
    describe ('with directives', function () {
      test('command', [
        [ 'ls # directive', {value: 'ls ', directives: ['directive']}, '1 directive'],
        [ 'ls # dir1, dir2', {value: 'ls ', directives: ['dir1', 'dir2']}, 'multiple directives (2)'],
        [ 'echo "# how nice is this" # orange', {value: 'echo "# how nice is this" ', directives: ['orange']}, 'hash within double quoted string is not interpreted as directive'],
        [ 'echo \'# how nice is this\' # orange', {value: 'echo \'# how nice is this\' ', directives: ['orange']}, 'hash within single quoted string is not interpreted as directive']
      ]);
    });
    
    describe ('with custom onError message', function () {
      test('command', [
        [ 'ls #! error', {value: 'ls ', errorMessage: 'error'}, 'error message']
      ]);
    });
    
  });
    
});

