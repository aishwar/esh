#### Command

    <shell-command>
    <shell-command> # <directive1>, <directive2>
    <shell-command> #! the on error exit message
    mv '# how are you'

#### Directive

    failable - do not terminate if this line fails

#### Exit

    exit:bad - Exit with an error code of 1
    exit:ok - Exit with an error code of 0

The `exit(<number>)` operation can be used to exit the script as well.

### Special Variable

    $command.ok - last command had return code 0 (numeric)
    $command.code - return code of the last command (numeric)
    $command.err - stderr output of the last command (string)
    $command.out - stdout output of the last command (string)

#### Comment

    # <comment>

#### Log to stdout

    ## <message> 

#### Log to stderr

    #! <message>

#### If

    if (<condition>) {
      <body>
    }
    
    if (<condition>) {
      <body>
    } else {
      <else-body>
    }

#### Switch [NOT IMPLEMENTED]

    switch (<variable>) {
      case <value1>:
        <case1-body>
        break
      case <value>:
        <case2-body>
        break
    }

#### Condition

    <expression>
    <not><expression>
    <comparison>
    
#### Comparison

    <expression> <operator> <expression>

### Expression

    <literal>
    <variable>
    <operation>

#### Literal

    <string>
    <number>
    <array(string)>

#### Variable

    $<name>

#### Operations

    number(<expression>:string) - <expression> has to return a <string>. Takes in the string and converts it to a number
    lines(<expression>:string) - <expression> has to return a <string>. Takes in a string and returns an array of strings
    glob(<expression>:string) - Takes in a glob expression and returns an array of file paths matching the expression
    exit(<expression>:number) - Exits the script with the passed in exit code

#### Operator

    ==
    !=
    <
    <=
    >
    >=

#### Loop

    loop (<array> : <var:$val>, <var:$idx>) {
      $val and $idx become available in this block
      break and continue are also available
      <body>
    }

#### Usage

    Usage {
      <string>
      <string>
    }

Example:

    Usage {
      '-f, --file <filename>: File to run process on'
      'This is general note on what this script does'
    }

#### Validation [NOT IMPLEMENTED]

Executes before the script body executes. This is a place to validate user input

    Validation {
      <body>
    }

#### onError

Executes when program is terminating due to an error in a command

    OnError {
      <body>
    }

#### Clean up

Executes when the program completes execution or is terminated

    CleanUp {
        <body>
    }
    