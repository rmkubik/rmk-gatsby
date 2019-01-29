---
title: Creating a Custom ESLint Rule with Internal State
date: 2018-12-20T04:57:02.568Z
tags: javascript, eslint, custom, state, node, program
category: til
---

# How do ESLint Rules Work?

## A Tutorial to Get Started

If you're unfamiliar with writing ESLint rules, [this tutorial got me up to speed](https://blog.webiny.com/create-custom-eslint-rules-in-2-minutes-e3d41cb6a9a0) on publishing a very simple custom ESLint rule. The next two sections will review some of the content covered in that tutorial. However, my article will not cover the integrating of the rule into a project like the linked tutorial does. After we review what an ESLint rule is, we'll look at implementing more a more complex one.

## Abstract Syntax Trees

ESLint is powered by a concept known as the [Abstract Syntax Tree (AST)](https://astsareawesome.com/#introducing-the-ast). The AST is a data structure that describes the parsed state of a section of code. It's made up of a series of nodes that have various child nodes and is similar structure to the DOM tree.

## Simple ESLint Rule

An ESLint rule works by creating a visitor function for a given [selector](https://eslint.org/docs/developer-guide/selectors). The selector is the name of the exported visitor function and it must correspond to a specific [AST Node Type (the ast-types library defines these)](https://github.com/benjamn/ast-types/blob/master/def/core.js). This pattern works for [creating basic, custom ESLint rules](https://eslint.org/docs/developer-guide/working-with-rules#rule-basics) that operate on one node at a time.

This example selector rule operates only on one `Identifier` node at a time. The visitor function checks to see if the node is named `'badName'` and then reports it if found. The `context.report` function allows you to report a provided node with an error message.

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

By listing multiple selector and visitor functions inside of a rule you can enable your rule to interact with more than one type of node.

This rule builds on the previous rule and also reports any `Literal` nodes that have a value of `'badValue'`.

```js
export default function(context) {
  return {
    Identifier(node) {
      if (node.name === 'badName') {
        context.report(node, "Don't create an identifier with badName");
      }
    },
    Literal(node) {
      if (node.value === 'badValue') {
        context.report(node, "Don't create a literal with badValue");
      }
    },
  };
}
```

## ESLint Rules With Internal State

Sometimes it can be useful to operate on a larger scope than a single node. Because an ESLint rule is contained within a normal JavaScript module, it can contain local state in private variables.

The following rule will search within the body of a function named `target` for a variable named `badName`. The rule will require three separate visitor functions that work together. We'll go over them one by one and then compose them.

### Determine When a Function Body is Entered

The first selector we'll need is `FunctionDeclaration`. The visitor function will check if the node has an id named `target`. If we've visited `target` we push the node onto a local variable, `targetFunctionStack`.

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

This was a simple example of an ESLint rule that uses multiple different visitor functions to accomplish its job. This can be useful in a variety of different cases. From ensuring no variables are declared inside of a beforeEach function to warnings about specific functions being called in a while loop.
