---
title: Creating a Custom ESLint Rule with Internal State
date: 2018-12-20T04:57:02.568Z
tags: javascript, eslint, custom, state, node, program
category: til
---

# How do ESLint Rules Work?

## A Tutorial to Get Started

If you're unfamiliar with writing small, custom ESLint rules [this tutorial got me up to speed](https://blog.webiny.com/create-custom-eslint-rules-in-2-minutes-e3d41cb6a9a0). The next two sections will review some of the content covered in that tutorial. However, my article will not cover the integration of the rule into a project. Please see the previously linked tutorial for information on that. After we review what an ESLint rule is, we'll look at implementing more a more complex one.

## Abstract Syntax Trees

ESLint relies on a concept called the [Abstract Syntax Tree (AST)](https://astsareawesome.com/#introducing-the-ast). The AST is a data structure that describes the parsed state of a section of code. It's made up of a series of nodes, each of which have various child nodes. This is a similar structure to the [DOM (Document Object Model)](https://en.wikipedia.org/wiki/Document_Object_Model).

Like the DOM has nodes of various types that describe an HTML page (`div`, `p`, `body`, etc), the AST nodes have types as well. Instead of a web document, AST nodes describe sections of code. This includes types like `Literal`, `FunctionDeclaration`, and `IfStatement`.

Each of these node types has a specific set of properties to which it must conform. You can find these types defined in the the [ast-types library on Github](https://github.com/benjamn/ast-types/blob/master/def/core.ts). The library describes these types using a syntax like below:

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

## Simple ESLint Rule

An ESLint rule works by creating a visitor function for a given [selector](https://eslint.org/docs/developer-guide/selectors). Generally, a selector is a string which matches the name of an [AST Node Type](https://github.com/benjamn/ast-types/blob/master/def/core.ts). This selector is used as the name of the function exported from the ESLint rule file. This function is called a "visitor function". This pattern works for [creating basic, custom ESLint rules](https://eslint.org/docs/developer-guide/working-with-rules#rule-basics) that operate on one node at a time.

The following example selector rule operates only on one [`Identifier`](https://github.com/benjamn/ast-types/blob/master/def/core.ts#L334) node at a time. The visitor function checks to see if the node is named `'badName'` and then reports it if found. The `context.report` function allows you to report a provided node with an error message.

```js
export default function(context) {
  return {
    Identifier(node) {
      if (node.name === 'badName') {
        context.report(node, "Don't create an identifier with badName");
      }
    },
  };
}
```

Check out the [rule snippet above in AST Explorer](https://astexplorer.net/#/gist/1ff99fca3f85c2e7676ac041a88d7b53/ad219d5af56a1b2e11e265ac2a371f239aa4020f), a tool that lets you modify AST transforms live.

# Building More Complex ESLint Rules

## ESLint Rules Can Affect Multiple Nodes

ESLint rules can contain multiple selectors and visitor functions. This enables your rule to to interact with more than one type of node.

This rule builds on the previous rule and also reports any [`Literal`](https://github.com/benjamn/ast-types/blob/master/def/core.ts#L341) nodes that have a value of `'wrongValue'`.

```js
export default function(context) {
  return {
    Identifier(node) {
      if (node.name === 'badName') {
        context.report(node, "Don't create an identifier with badName");
      }
    },
    Literal(node) {
      if (node.value === 'wrongValue') {
        context.report(node, "Don't create a literal with wrongValue");
      }
    },
  };
}
```

This is the [updated rule snippet](https://astexplorer.net/#/gist/1ff99fca3f85c2e7676ac041a88d7b53/2f9686c48d09fd0fd9ae1026088968a93875b065) that identifies both bad nodes.

## ESLint Rules With Internal State

Sometimes it can be useful to operate on a larger scope than a single node. Because an ESLint rule is contained within a normal JavaScript module, it can contain local state in private variables.

The following rule will search within the body of a function named `target` for a variable named `badName`. The rule will require three separate visitor functions that work together. We'll go over them one by one and then compose them.

### Determine When a Function Body is Entered

The first selector we'll need is [`FunctionDeclaration`](https://github.com/benjamn/ast-types/blob/master/def/core.ts#L180). The visitor function will check if the node has an id named `target`. If we've visited `target` we push the node onto a local variable, `targetFunctionStack`.

```js
const targetFunctionStack = [];

FunctionDeclaration(node) {
  if (node.id.name === 'target') {
    targetFunctionStack.push(node);
  }
}
```

### Only Report Variables After a Function is Found

Then, we reuse the `Identifier` visitor function from before with an added condition. The `isFunctionOnStack` function ensures a target function has been put on the stack. This will prevent the rule from flagging an `Identifier` with `badName` unless the rule has already found the `target` function.

```js
const isFunctionOnStack = () => targetFunctionStack.length > 0;

Identifier(node) {
  if (isFunctionOnStack() && node.name === 'badName') {
    context.report(node, 'Don\'t create an identifier with badName');
  }
}
```

### Detect When the Function Body Has Been Exited

This final selector takes advantage of the ESLint `:exit` selector. When you append `:exit` to the end of a selector, ESLint will call the visitor function while traversing up the AST instead of down.

This visitor function will pop the node off the stack so that we know we've left the body of the function. Now the next `Identifier` visitor function will no longer report its node.

```js
'FunctionDeclaration:exit': function(node) {
  if (node.id.name === 'target') {
    targetFunctionStack.pop();
  }
}
```

### Bringing It All Together

Finally we combine all the previous visitor functions into a complete rule module.

```js
const targetFunctionStack = [];

const isFunctionOnStack = () => targetFunctionStack.length > 0;

export default function(context) {
  return {
    FunctionDeclaration(node) {
      if (node.id.name === 'target') {
        targetFunctionStack.push(node);
      }
    },
    Identifier(node) {
      if (isFunctionOnStack() && node.name === 'badName') {
        context.report(node, "Don't create an identifier with badName");
      }
    },
    'FunctionDeclaration:exit': function(node) {
      if (node.id.name === 'target') {
        targetFunctionStack.pop();
      }
    },
  };
}
```

You can adjust and run the [final rule on ASTExplorer](https://astexplorer.net/#/gist/1ff99fca3f85c2e7676ac041a88d7b53/179cf88e3a77c133741d9f96f0dc982b9f11ce4d).

## Conclusion

This was an example of an ESLint rule that uses multiple different visitor functions to do its job. This can be useful in a variety of different cases. From preventing variable declarations inside of a beforeEach function to warnings about dangerous function calls in a while loop.
