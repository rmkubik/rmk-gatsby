---
title: Understanding Abstract Syntax Trees
date: 2018-12-20T04:57:02.568Z
tags: javascript, abstract, syntax, trees, node, ast
category: til
---
ESLint relies on a concept called the [Abstract Syntax Tree (AST)](https://astsareawesome.com/#introducing-the-ast). The AST is a data structure that describes the parsed state of a section of code. It's made up of a series of nodes, each of which have various child nodes. This is a similar structure to the [DOM (Document Object Model)](https://en.wikipedia.org/wiki/Document_Object_Model).

Like the DOM has nodes of various types that describe an HTML page (`div`, `p`, `body`, etc), the AST nodes have types as well. Instead of a web document, AST nodes describe sections of code. This includes types like `Literal`, `FunctionDeclaration`, and `IfStatement`.

Each of these node types has a specific set of properties to which it must conform. You can find these types defined in the the [ast-types library on Github](https://github.com/benjamn/ast-types/blob/master/def/core.ts).
The library describes these types using a syntax like below:

```js
def("Statement").bases("Node");
def("Expression").bases("Node", "Pattern");
def("Pattern").bases("Node");

def("IfStatement")
  .bases("Statement")
  .build("test", "consequent", "alternate")
  .field("test", def("Expression"))
  .field("consequent", def("Statement"))
  .field("alternate", or(def("Statement"), null), defaults["null"]);
```

Let's explore this definition of an `IfStatement` to understand AST Types definition syntax. The `IfStatement` inherits from a base node called `Statement`. `Statement` is an empty `Node` with no special requirements. To build an If Statement you must provide three fields, a `test`, a `consequent`, and an `alternate`.

Each of these fields are defined as follows:

- test - the conditional check in the if statement, and is a Node of type `Expression`
- consquent - the code executed if the statement is true, and is of type `Statement`
- alternate - the optional code executed if the statement is false, and is of type `Statement`

We can use these same concepts to understand the various properties of other types of Nodes listed in the AST Types library.
