# esh

### What is it?

A nicer shell scripting language.

### Why?

Please read the [motivation](docs/motivation.md) here

### How does it look?

`esh` scripts do not allow run-time variable assignment. Values can be declared in a separate file. These values can be accessed in your script file. This was a design decision, as I find variable declaration and assignment to be distracting when you write shell scripts of some complexity.
 
Here is what it looks like:

 - Script file: [dream.jsh](sample/dream.jsh)
 - Properties file: [dream.vals](sample/dream.vals)

### Is there a language cheat sheet?

Yup, here is the [spec](docs/spec.md).
