
load('abc')

Usage {
  '-f, --file <filename>: Do something with this file'
}

Main {
  ## moving abc to def
  mv abc def
}

OnError {
  #! Exiting due to error
}

CleanUp {
  ## Clean up executed
}
