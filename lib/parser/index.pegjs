
start =
    comparison
  / operator
  / expression
  / log_err
  / log
  / comment
  / whitespace

// Comparison
comparison =
    whitespace left:expression whitespace op:operator whitespace right:expression whitespace {
      return {
        type: 'comparison',
        operator: op,
        left: left,
        right: right
      };
    }


// Whitespace
whitespace =
    chars:[ \n\r\t]* {
      return {
        type: 'whitespace',
        value: chars.join('')
      };
    }

// Expression
expression =
    variable
  / literal

// Variable
variable =
    "$" name:[a-zA-Z0-9\.]* {
      return {
        type: 'variable',
        value: name.join('')
      };
    }

// Operator
operator =
    "==" {
      return {
        type: 'operator',
        value: '=='
      };
    }
  / "!=" {
      return {
        type: 'operator',
        value: '!='
      }
    }
  / ">=" {
      return {
        type: 'operator',
        value: '>='
      }
    }
  / ">" {
      return {
        type: 'operator',
        value: '>'
      }
    }
  / "<=" {
      return {
        type: 'operator',
        value: '<='
      }
    }
  / "<" {
      return {
        type: 'operator',
        value: '<'
      }
    }

// Log Error Message
log_err =
  "#! " char:.* {
    return {
      type: 'log:err',
      value: char.join('')
    };
  }

// Log Message
log =
  "## " char:.* {
    return {
        type: 'log:out',
        value: char.join('')
      };
  }

// Comment
comment = 
    "#" char:.* {
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
    "\\" char:. { return char; }
