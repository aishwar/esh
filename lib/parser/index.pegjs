
{
  function decorate(obj) {
    obj.position = {
      line: line(),
      column: column(),
      toString: function () {
        return 'line: ' + obj.line + ', column: ' + column;
      }
    };
    return obj;
  }
}

start =
    e:(whitespace/block/statement)* {
      return e.filter(function (obj) {
        // Remove null nodes (whitespaces)
        return obj;
      });
    }
 
command =
    // onError message specified
    !'}' command:(command_word/command_quoted_str)+ '#! ' letters:[^\r\n]* {
      return decorate({
        type: 'command',
        value: command.join(''),
        errorMessage: letters.join('')
      });
    }
    // directives specified
  / !'}' command:(command_word/command_quoted_str)+ '# ' letters:[^\r\n]* {
      return decorate({
        type: 'command',
        value: command.join(''),
        directives: letters.join('').split(',').map(function (s) { return s.trim(); })
      });
    }
    // Command does not begin with a '}'
  / !'}' command:(command_word/command_quoted_str)+  {
      return decorate({
        type: 'command',
        value: command.join('')
      });
    }

command_word =
    chars:[^#'"\r\n]+ {
      return chars.join('');
    }

statement =
    special_word
  / if
  / loop
  / operation
  / expression
  / log_err
  / log
  / comment
  / command

// special words
special_word =
    name:('exit:bad'/'exit:ok') {
      return decorate({
        type: 'special-word',
        name: name
      });
    }

// operation
operation =
    name:('number'/'lines'/'glob'/'load') whitespace_seq '(' whitespace_seq input:expression whitespace_seq ')' {
      return decorate({
        type: 'operation',
        name: name,
        input: input
      });
    }

loop = 
    'loop' whitespace_seq '(' 
          whitespace_seq list:(variable/operation) whitespace_seq 
      ':' whitespace_seq value:variable whitespace_seq
      ',' whitespace_seq index:variable whitespace_seq
    ')' whitespace_seq '{'
      body: statements_or_whitespaces
    '}' {
      return decorate({
        type: 'loop',
        list: list,
        valueProperty: value,
        indexProperty: index,
        body: body
      });
    }

statements_or_whitespaces =
    matches: (whitespace/statement)* {
      return matches.filter(function (obj) {
        // Remove all null nodes (whitespace)
        return obj;
      });
    }

// Code blocks: e.g. OnError, CleanUp, Usage
block =
    name:('OnError'/'CleanUp'/'Usage'/'Main') whitespace_seq '{'
      body: statements_or_whitespaces
    '}' {
      return decorate({
        type: 'block',
        name: name,
        body: body
      });
    }

// If
if =
    main:if_only whitespace_seq 'else' whitespace_seq '{'
      alternate: statements_or_whitespaces
    '}' {
      main.alternate = alternate;
      return decorate(main);
    }
  / if_only
    
if_only =
    'if' whitespace_seq '(' whitespace_seq condition:(comparison/negated_expression/expression) whitespace_seq ')' whitespace_seq '{' 
      body: statements_or_whitespaces
    '}' {
      return decorate({
        type: 'if',
        condition: condition,
        body: body
      });
    }

// Comparison
comparison =
    left:expression whitespace_seq op:operator whitespace_seq right:expression {
      return decorate({
        type: 'comparison',
        operator: op,
        left: left,
        right: right
      });
    }

// Whitespace
whitespace =
    [ \n\r\t] {
      return null;
    }

whitespace_seq =
    [ \n\r\t]* {
      return null;
    }
    
// Negated expression
negated_expression =
    '!' e:expression {
      return decorate({
        type: 'not',
        value: e
      });
    }

// Expression
expression =
    variable
  / literal

// Variable
variable =
    '$' name:[a-zA-Z0-9\.]+ {
      name = name.join('');
      
      return decorate({
        type: 'variable',
        name: name,
        valueType: (name === 'command.ok') ? 'number' : 'string'
      });
    }

// Operator
operator =
    value:('==' / '!=' / '>=' / '>' / '<=' / '<') {
      return decorate({
        type: 'operator',
        value: value
      });
    }

// Log Error Message
log_err =
  '#! ' char:[^\n\r]* {
    return decorate({
      type: 'log:err',
      value: char.join('')
    });
  }

// Log Message
log =
  '## ' char:[^\n\r]* {
    return decorate({
        type: 'log:out',
        value: char.join('')
      });
  }

// Comment
comment = 
    '#' char:[^\n\r]* {
      return decorate({
        type: 'comment',
        value: char.join('')
      });
    }

literal =
    number
  / quoted_str

// Number
number =
    digits:[0-9]+ {
      return decorate({
        type: 'literal:number',
        value: parseInt(digits.join(''), 10),
        valueType: 'number'
      });
    }

// QuotedString
quoted_str = 

    // Single quoted string
    sqt c:(dqt/char)* sqt {
      return decorate({
        type: 'literal:string',
        value: c.join(''),
        valueType: 'string'
      });
    }

    // Double quoted string
  / dqt c:(sqt/char)* dqt {
      return decorate({
        type: 'literal:string',
        value: c.join(''),
        valueType: 'string'
      });
    }


// Helper tokens
sqt = "'"
dqt = '"'

char =
    esc_seq
  / [^\\'"]

esc_seq =
    '\\' char:. { return char; }

command_quoted_str =
    // Single quoted string
    a:sqt b:(dqt/command_quoted_str_char)* c:sqt {
      return a + b.join('') + c;
    }
    // Double quoted string
  / a:dqt b:(sqt/command_quoted_str_char)* c:dqt {
      return a + b.join('') + c;
    }


command_quoted_str_char =
    command_quoted_str_esc_seq
  / [^\\'"]
  
command_quoted_str_esc_seq =
    '\\' char:. { return '\\' + char; }
