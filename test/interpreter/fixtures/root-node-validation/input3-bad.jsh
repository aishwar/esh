
load('abc')
load('def')

Usage {
  '-f, --file <filename>: Do something with this file'
}

load('abc')

Main {
  ## moving abc to def
  mv abc def
}

CleanUp {
  ## Clean up executed
}
