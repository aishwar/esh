
start =
    quoted_str
  / log_err
  / log
  / comment

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
