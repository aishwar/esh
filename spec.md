#### Command

    <shell-command>
    <shell-command> # <directive1>, <directive2>

##### Short cut on command execution error handling

This:

    run command # failable
    
    if (!$command.ok) {
      #! run command failed
      exit:bad
    }

can be shrunk to:

    run command #! run command failed

#### Directive

    failable - do not terminate if this line fails

#### Exit

    exit <number>
    exit:bad - Exit with an error code of 1
    exit:ok - Exit with an error code of 0

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

#### Condition

    <expression>
    <not><expression>
    <expression> <operator> <expression>

#### Literal

	<string>
	<number>
	<array(string)>

### Expression

	<literal>
    <variable>
    <operation>

#### Operations

    number(<string>) - Takes in a string and converts it to a number
	lines(<string>) - Takes in a string and returns an array of strings
    glob(<string>) - Takes in a glob expression and returns an array of file paths matching the expression

#### Operator

    ==
    !=
    <
    <=
    >
    >=

#### Variable

    $<name>

#### Switch

    switch (<condition>) {
      case <value1>:
        <case1-body>
        break
      case <value>:
        <case2-body>
        break
    }

#### Loop

    loop (<array>) {
      $val and $idx become available in this block
      break and continue are also available
      <body>
    }

#### Usage

    Usage {
      <Option Description 1>
      <Option Description 2>
    }

#### Option Description

    -<short-opt>, --<long-opt> <other-params>: <description>

For example:

    -f, --file <filename>: File to run process on

#### Validation

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
    