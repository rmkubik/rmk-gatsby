---
title: "Create a Custom ESLint Rule: Automatically Share Your Team's Tribal Knowledge"
date: 2019-03-08
tags: javascript, eslint, custom, state, node, program, team, tribal, knowledge
---

ESLint is a tool built to provide linting of JavaScript code. Linting is a form of static analysis that detects patterns in code that could cause errors. By running ESLint as you write code you're able to catch these errors without even running your code. This speeds up development time and helps you write less error prone code.

One of the core philosophies of ESLint is that "everything is pluggable". This means that every pattern, or rule, including those bundled with the tool use ESLint's Rule API. This allows developers to write rules with the same flexibility as the creators. The open-source community around ESLint writes rules to define best practices, identify common issues, and bundle popular presets.

These open-sourced rules allow teams to customize ESLint for their specific requirements. However, sometimes a rule doesn't exist or work in quite the right way for your use case. This article explores how to create custom ESLint rules for your team's unique situation.

## How do ESLint Rules Work?

### A Tutorial to Get Started

If you're unfamiliar with writing small, custom ESLint rules, [this tutorial got me up to speed](https://blog.webiny.com/create-custom-eslint-rules-in-2-minutes-e3d41cb6a9a0). The next two sections will review some of the content covered in that tutorial. However, my article won't cover the integration of the rule into a project because the tutorial covers it succintly already. After we review what an ESLint rule is, we'll look at implementing more a more complex one (if you're already comfortable with simple rules, you can [jump ahead](#Building-More-Complex-ESLint-Rules)).

### Abstract Syntax Trees

ESLint relies on a concept called the [Abstract Syntax Tree (AST)](https://astsareawesome.com/#introducing-the-ast). The AST is a data structure that describes the parsed state of a section of code. It's made up of a series of nodes, each of which have various child nodes. This tree forms a similar structure to the [DOM (Document Object Model)](https://en.wikipedia.org/wiki/Document_Object_Model).

The DOM has nodes of various types that describe an HTML page (`div`, `p`, `body`, etc). Instead of a web document, the AST's nodes describe sections of code using types like `Literal`, `FunctionDeclaration`, and `IfStatement`. Each of these node types has a specific set of properties to which it must conform. You can find these types defined in the the [ast-types library on Github](https://github.com/benjamn/ast-types/blob/master/def/core.ts).

### Simple ESLint Rule

An ESLint rule is defined by creating a "visitor function" for a given [selector](https://eslint.org/docs/developer-guide/selectors). Generally, a selector is a string which matches the name of an [AST Node Type](https://github.com/benjamn/ast-types/blob/master/def/core.ts). This selector is used as the name of the function exported from the ESLint rule file. The visitor function for the corresponding selector is called once everytime a matching node is visited. This pattern works for [creating basic, custom ESLint rules](https://eslint.org/docs/developer-guide/working-with-rules#rule-basics) that operate on one node at a time.

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

## Building More Complex ESLint Rules

### ESLint Rules Can Affect Multiple Nodes

ESLint rules can contain multiple selectors and visitor functions. This enables your rule to interact with more than one type of node.

This rule builds on the previous rule, also reporting any [`Literal`](https://github.com/benjamn/ast-types/blob/master/def/core.ts#L341) nodes that have a value of `'wrongValue'`.

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

### ESLint Rules With Internal State

Sometimes it can be useful to operate on a larger scope than a single node. Because an ESLint rule is contained within a normal JavaScript module, it can contain local state in private variables.

The following rule will search within the body of a function named `target` for a variable named `badName`. The rule will require three separate visitor functions that work together. We'll go over them one by one and then compose them.

#### Determine When a Function Body is Entered

The first selector we'll need is [`FunctionDeclaration`](https://github.com/benjamn/ast-types/blob/master/def/core.ts#L180). The visitor function will check if the node has an id named `target`. If we've visited `target` we push the node onto a local variable, `targetFunctionStack`.

```js
const targetFunctionStack = [];

FunctionDeclaration(node) {
  if (node.id.name === 'target') {
    targetFunctionStack.push(node);
  }
}
```

#### Only Report Variables After a Function is Found

Then, we reuse the `Identifier` visitor function from before with an added condition. The `isFunctionOnStack` function ensures a target function has been put on the stack. This will prevent the rule from flagging an `Identifier` with `badName` unless the rule has already found the `target` function.

```js
const isFunctionOnStack = () => targetFunctionStack.length > 0;

Identifier(node) {
  if (isFunctionOnStack() && node.name === 'badName') {
    context.report(node, 'Don\'t create an identifier with badName');
  }
}
```

#### Detect When the Function Body Has Been Exited

This final selector takes advantage of the ESLint `:exit` selector. When you append `:exit` to the end of a selector, ESLint will call the visitor function while traversing up the AST instead of down.

This visitor function will pop the node off the stack so that we know we've left the body of the function. Now the next `Identifier` visitor function will no longer report its node.

```js
'FunctionDeclaration:exit': function(node) {
  if (node.id.name === 'target') {
    targetFunctionStack.pop();
  }
}
```

#### Bringing It All Together

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

## Share Tribal Knowledge with ESLint

Many trivial problems with code like incorrect variable names or missing function parameters can be resolved by visiting a single AST node. For everything else, these complex ESLint rules begin to shine.

Perhaps your tests require resetting their sandbox after you've initialized it. A new developer may not be aware this reset function should be called. An ESLint rule that maintains internal state could detect the sandbox initialization method and ensure a subsequent reset call occurs.

Hopefully this article empowers you to think of ESLint as a solution for problems beyond simple syntax errors. A small set of rules customized for your team can help remind developers of unique facets of your code base.
