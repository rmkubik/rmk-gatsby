---
title: Using the Regex Global Flag with Test
date: 2019-06-26
tags: javascript, regex, global, test, gotcha
category: til
---

Using regexes in JavaScript can be tricky! One new gotcha I ran into today involves the usage of the `g` or global flag. The global flag matches against all occurences of the regex. This can be useful to find how many times a regex is matched inside a phrase.

You can enable the `g` flag in a few ways:

```js
const regexSyntax = /test/g;
const regexConstructed = new RegExp('test', 'g');
```

When you use the `g` flag in combination with the regex `test` function you can run into some unexpected behavior. 

```js
const regex = /phrase/g;

// command:           // output:
regex.test('phrase'); // true
regex.test('phrase'); // false
regex.test('phrase'); // true
regex.test('phrase'); // false
```

The above occurs because the regex object will save the `lastIndex` of a match between calls when it has the `g` property enabled. The next time `test` is called, the regex will start matching at this `lastIndex` value. Once `test` is called and no match is found after the current `lastIndex` value, it is reset to 0.

Here is the above code snippet wth the addition of logging `lastIndex` before and after every `test` call.

```js
const regex = /phrase/g;

// command:           // output:
regex.lastIndex       // 0
regex.test('phrase'); // true
regex.lastIndex       // 6
regex.test('phrase'); // false
regex.lastIndex       // 0
regex.test('phrase'); // true
regex.lastIndex       // 6
regex.test('phrase'); // false
regex.lastIndex       // 0
```

This happens because a global regex `test` is intended to be called multiple times in a row on the same input.

Here's an example where we expect to get multiple matches on an input string:

```js
const regex = /phrase/g;

// command:           // output:
regex.lastIndex       // 0
regex.test('phrase phrase phrase'); // true
regex.lastIndex       // 6
regex.test('phrase phrase phrase'); // true
regex.lastIndex       // 13
regex.test('phrase phrase phrase'); // true
regex.lastIndex       // 20
regex.test('phrase phrase phrase'); // false
regex.lastIndex       // 0
```


## sources

https://stackoverflow.com/questions/2851308/why-does-my-javascript-regex-test-give-alternating-results
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/global
