
start =
    str

str = 
    sqt c:(dqt/char)* sqt { return c.join(''); }
  / dqt c:(sqt/char)* dqt { return c.join(''); }

sqt = "'"
dqt = '"'

char =
    esc_seq
  / [^\\'"]

esc_seq =
    "\\" char:. { return char; }
