---
title: 'Testing for a Race Condition in Async/Await Code'
date: 2019-10-31
tags: async, await, race, condition, test, function, sleep, timeout, time, out, asynchronous, bug, debug
category: til
---

## Race Conditions

Sometimes a series of asynchronous functions in an application must execute in the correct order for the app to work correctly. If an earlier function in the series does something like make a network request, that request could run slowly sometimes. Since the functions are running at the same time, this first function may resolve later than intended.

Asynchronous functions resolving at different times can cause bugs that don't appear consistently every time the app is started. This particular brand of inconsistently appearing bug is called a race condition.

## Reproduction

Because of their inconsistency, bugs caused by race conditions can be very tricky to reproduce. One way to reproduce a race condition like this is to intentionally introduce delay into an asynchronous function that would normally execute first. The following bit of code will create a 5 second timeout and wait for it to resolve before continuing.

```js
await (function() {
  return new Promise((resolve) => setTimeout(resolve, 5000));
})();
```

Here is the above immediately invoked function rewritten as a reusable function.

```js
function sleep(interval) {
  return new Promise((resolve) => setTimeout(resolve, interval));
}

await sleep(5000);
```

By using this function in various places you suspect are causing a race condition, you can narrow your suspects and hopefully reliably reproduce your bug!
