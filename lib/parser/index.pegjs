
start =
    quoted_str

// QuotedString
quoted_str = 
    sqt c:(dqt/char)* sqt {
        return {
          type: 'quoted-string',
          value: c.join('')
        };
      }
  / dqt c:(sqt/char)* dqt {
        return {
          type: 'quoted-string',
          value: c.join('')
        };
      }

sqt = "'"
dqt = '"'

char =
    esc_seq
  / [^\\'"]

esc_seq =
    "\\" char:. { return char; }
