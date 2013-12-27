
start =
    block
  / statement
  / command
  / whitespace_seq

command =
    whitespace_seq command:(command_word/command_quoted_str)+ whitespace_seq {
      return {
        type: 'command',
        value: command.join('')
      };
    }

command_word =
    chars:[^#'"\r\n\t]+ {
      return chars.join('');
    }

statement =
    whitespace_seq statement:(
    special_word
  / if
  / operation
  / expression
  / log_err
  / log
  / comment) whitespace_seq {
    return statement;
  }

// special words
special_word =
    name:('exit:bad'/'exit:ok') {
      return {
        type: 'special-word',
        name: name
      };
    }

// operation
operation =
    name:('number'/'lines'/'glob') whitespace_seq '(' whitespace_seq input:expression whitespace_seq ')' {
      return {
        type: 'operation',
        name: name,
        input: input
      };
    }

// Code blocks: e.g. OnError, CleanUp, Usage
block =
    name:('OnError'/'CleanUp'/'Usage') whitespace_seq '{'
      whitespace_seq
      body:statement*
    '}' {
      return {
        type: 'block',
        name: name,
        body: body
      };
    }

// If
if =
    main:if_only whitespace_seq 'else' whitespace_seq '{'
      whitespace_seq
      alternate:statement*
    '}' {
      main.alternate = alternate;
      return main;
    }
  / if_only
    
if_only =
    'if' whitespace_seq '(' whitespace_seq condition:(comparison/negated_expression/expression) whitespace_seq ')' whitespace_seq '{' 
      // can contain just whitespace or statements
      whitespace_seq
      body:statement*
    '}' {
      return {
        type: 'if',
        condition: condition,
        body: body
      };
    }

// Comparison
comparison =
    whitespace_seq left:expression whitespace_seq op:operator whitespace_seq right:expression whitespace_seq {
      return {
        type: 'comparison',
        operator: op,
        left: left,
        right: right
      };
    }


// Whitespace
whitespace =
    char:[ \n\r\t] {
      return {
        type: 'whitespace',
        value: char
      };
    }

whitespace_seq =
    chars:[ \n\r\t]* {
      return {
        type: 'whitespace',
        value: chars.join('')
      };
    }
    
// Negated expression
negated_expression =
    '!' e:expression {
      return {
        type: 'not',
        value: e
      };
    }

// Expression
expression =
    variable
  / literal

// Variable
variable =
    '$' name:[a-zA-Z0-9\.]* {
      return {
        type: 'variable',
        value: name.join('')
      };
    }

// Operator
operator =
    value:('==' / '!=' / '>=' / '>' / '<=' / '<') {
      return {
        type: 'operator',
        value: value
      };
    }

// Log Error Message
log_err =
  '#! ' char:[^\n\r]* {
    return {
      type: 'log:err',
      value: char.join('')
    };
  }

// Log Message
log =
  '## ' char:[^\n\r]* {
    return {
        type: 'log:out',
        value: char.join('')
      };
  }

// Comment
comment = 
    '#' char:[^\n\r]* {
      return {
        type: 'comment',
        value: char.join('')
      };
    }

literal =
    number
  / quoted_str

// Number
number =
    digits:[0-9]+ {
      return {
        type: 'literal:number',
        value: parseInt(digits.join(''), 10)
      };
    }

// QuotedString
quoted_str = 

    // Single quoted string
    sqt c:(dqt/char)* sqt {
      return {
        type: 'literal:string',
        value: c.join('')
      };
    }

    // Double quoted string
  / dqt c:(sqt/char)* dqt {
      return {
        type: 'literal:string',
        value: c.join('')
      };
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
