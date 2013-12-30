## I have a dream...

I want to write well structured, robust and easy to read scripts for automating tasks in the shell. I want to write scripts that:

 - provide a nice usage help menu
 - support options auto-completion
 - that have nice error handling/recovery
 - are robust; they don't let me shoot myself in the foot
 - are simple to write with a low learning curve

You may ask why not shell scripts? Using shell commands in shell scripts is nice. But trying to do control flow or anything more complex, the code starts looking very strange. I can get used to it and become a shell script ninja, but I thought I'd rather write an alternative to it. Also, I'll get a kick out of writing a DSL/language. What better reason right? 

## Shell scripts are nice!

It is easy to say things like this in a shell script:

 - `cp -rf folder1/* folder3/` to copy all the content of folder1 to folder3
 - `git clone $repo` to clone from a git repo
 - `mkdir new-folder` to create a new folder

The above are nicer than:

 - `sh.cp('-r', 'folder1/*', 'folder3')`
 - `git.clone(repo)`
 - `sh.mkdir('new-folder')`

I was trying to keep the above close to the shell commands; with the actual APIs available in programming languages, chances are it's more verbose than that. Even in the above example, all those "sh", the dots, the parentheses and the quotes. So much unnecessary effort!

So there, that's my argument on why shell scripts are nice. For things we normally type in on the command line, shell commands are easy and intuitive to express.

## But Shell scripts also suck!

What I say here is a matter of personal taste. You may completely disagree with me and love shell scripting as is; well, good for you!

What sucks about shell scripts?

 - I don't like how the control flow structures look. They are too verbose, have a weird structure (square brackets, semicolons in the middle, double semicolon for breaks in case statements etc.)

        if [ "$num" -gt "10" ]; then
        fi

 - Option handling isn't fun. If I wanted to write a script with 5 different options, this would be a pain.

        while [ "$1" != "" ]; do
          case $1 in
            -f | --file )   shift
                            filename=$1
                            ;;
            * )             usage
                            exit 1
          esac
          shift
        done

 - There are too many gotchas (quote your variables in case it represents a file name so `[ -e "$file" ]` would work, shell scripts keep executing after error by default, unset variables are empty strings, use single quote when you use wildcards for the `<arg>` in `trap <arg> <sigspec>` because the wildcard gets expanded when the trap statement is executed not when the `<arg>` is executed etc.)
 
 - The right thing is harder to do (printing to stdout? do `echo "<message>" >&1`; printing to stderr? do `echo "<message>" >&2`. But you know what I did up to now? `echo "<message>"` And I am sure I am not the only one. Also shell scripts do not encourage you to think about error handling. As you learn more, that's eventually something you start doing)


## What do we need?

The nice-ness of the shell commands, an expressive syntax of a language like JavaScript and a design that makes it easy for you to do the right thing and forces you to do it.

With that hope, I am designing `esh` (easy shell? enhanced shell?). Wish me luck!

Sources:

 - [http://stackoverflow.com/questions/78497/design-patterns-or-best-practices-for-shell-scripts](http://stackoverflow.com/questions/78497/design-patterns-or-best-practices-for-shell-scripts)
 - [http://andreinc.net/2011/09/04/bash-scripting-best-practice/](http://andreinc.net/2011/09/04/bash-scripting-best-practice/)
 - [http://kvz.io/blog/2013/11/21/bash-best-practices/](http://kvz.io/blog/2013/11/21/bash-best-practices/)
 - [http://www.linuxjournal.com/content/use-bash-trap-statement-cleanup-temporary-files](http://www.linuxjournal.com/content/use-bash-trap-statement-cleanup-temporary-files)

