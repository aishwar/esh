
start =
    quoted_str
  / log
  / comment

// Log Message
log =
  "## " char:.* {
    return {
        type: 'log',
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
        type: 'quoted-string',
        value: c.join('')
      };
    }

    // Double quoted string
  / dqt c:(sqt/char)* dqt {
      return {
        type: 'quoted-string',
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
