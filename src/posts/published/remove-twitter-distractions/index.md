---
title: Clean up your Twitter Experience with TamperMonkey
date: 2020-04-29
tags: twitter, tampermonkey, tamper, monkey, distractions, attention, javascript, clean, remove, hide
---

The longer Twitter exists, the more new features appear that I just don't have any interest in using. They're either designed to keep me from ever leaving the website, or I'm just too set in my ways to try something new. Either way, I don't want to see them!

With a bit of JavaScript knowledge and a neat [browser extension called TamperMonkey](https://www.tampermonkey.net/) it's possible to edit the websites you browse every day to work better for your own needs.

## How do I edit someone else's website?

The problem with these new features is that Twitter, like most websites don't really let you just turn off random bits of their websites. Fortunately, since they ship their whole website to my computer via the browser they can't stop me!

### Search: Find the offending element

First we need to identify the element we want to hide. Most of Twitter's identifying CSS classes and ids are pretty obfuscated these days. Fortunately good accessible HTML elements are still reliably discoverable for us! We're going to use [aria-label](https://a11y-101.com/development/aria-label) to identify elements on the screen in the developer console. Let's target Twitter's "trending" section.

```jsx
document.querySelector('[aria-label*="trend" i]');
```

The above [CSS attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) matches alements with an `aria-label` attribute containing "trend" compared case insensitively.

### Destroy: Hide the offending element

Now that we can locate an element, we can apply some CSS to prevent our offending HTML element from displaying. We'll use JavaScript to set the display style property on the element to `none`.

```jsx
const targetedElement = document.querySelector('[aria-label*="trend" i]');
targetedElement.style.display = 'none';
```

## I have to do this every time I load the page?

We've got a small script that let's us hide an element of Twitter that we don't want to see. However, we still need to manually do this every time we load up Twitter. Let's check out [an extension called TamperMonkey that will let us execute a JavaScript file every time we visit a specified URL](https://www.tampermonkey.net/) on the document's `onload` event.

You can install TamperMonkey via the Chrome, Microsoft Edge, Safari, Opera Next, or Firefox extension stores.

### TamperMonkey UserScript metadata

TamperMonkey calls these JavaScript files UserScripts. There are [a lot of pre-existing scripts](https://www.tampermonkey.net/scripts.php) out there that others have made. They're created with [a lot of metadata options](https://www.tampermonkey.net/documentation.php) like the name of the script. Most of this information is used to identify the script and what it does.

From the TamperMonkey browser extension, let's [create a new script](https://www.tampermonkey.net/faq.php#Q102) with the following metadata.

```jsx
// ==UserScript==
// @name         Remove Twitter Cruft
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove unwanted sections of Twitter
// @author       You
// @match        https://twitter.com/*
// @grant        none
// ==/UserScript==
```

One important metadata property we need to be sure to set correctly is `@match`. This identifies what URLs we want to run our JavaScript on. For this project, we'll want to identify `https://twitter.com/*`. We use the wildcard operator `*` to match any page on Twitter's root domain.

### TamperMonkey modules

Finally, we'll insert our JavaScript code into [the IIFE module format](https://medium.com/@vvkchandra/essential-javascript-mastering-immediately-invoked-function-expressions-67791338ddc6) that TamperMonkey expects. Be sure to [enable this script from TamperMonkey's dashboard](https://www.tampermonkey.net/faq.php#Q101). Now any time you visit a page on Twitter you should see our console hello message.

```jsx
// ==UserScript==
// @name         Remove Twitter Cruft
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove unwanted sections of Twitter
// @author       You
// @match        https://twitter.com/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const targetedElement = document.querySelector('[aria-label*="trend" i]');
  targetedElement.style.display = 'none';

  console.log('Hello from TamperMonkey');
})();
```

## Why doesn't this always work?

You'll notice that while our script does send our console log message successfully, it doesn't seem to actually hide the "trending" element very well. This is because the element isn't loaded on the page when the document is loaded.

Another problem is that Twitter is a [SPA (single page application)](https://flaviocopes.com/single-page-application/). Navigating around the site doesn't actually trigger a document reload. This means our script to hide elements doesn't get re-run!

### Watch for DOM changes with the Mutation Observer

A relatively recent addition to browsers is the `MutationObserver`. This object lets you listen for various types of changes in the DOM and trigger a callback in response to those changes.

We're going to attach a MutationObserver to the document body and track all HTML elements that change while we're on Twitter. This requires [some boilerplate that the Mozilla Developer Network talks about in this example](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).

For each mutation that the observer detects, we'll check if the DOM contains our targeted "trending" element. If this element is present, we'll set the same CSS on the element to hide it that we were doing before.

```jsx
(function() {
  'use strict';

  // Select the node that will be observed for mutations
  const targetNode = document.querySelector('body');

  // Options for the observer (which mutations to observe)
  const config = { attributes: true, childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (let mutation of mutationsList) {
      const targetedElement = document.querySelector('[aria-label*="trend" i]');

      if (targetedElement) {
        targetedElement.style.display = 'none';
        console.log('Remove targeted element!');
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
})();
```

If you refresh Twitter and navigate around the website, you shouldn't see the "trending" section we identified any longer! Hurray!

## What if I want to get rid of more elements?

I don't know about you, but there's more than one Twitter feature I want no part of. To hide those too, we're going to upgrade our UserScript to take an array of targets we want to hide. I want to hide Twitter's "who to follow" section as well as the "trending" section. My targets array will represent those two items:

```jsx
const targets = ['[aria-label*="trend" i]', '[aria-label*="who to follow" i]'];
```

Instead of a searching for and hiding a single item we'll iterate through the targets array for every observed change.

```jsx
(function() {
  'use strict';

  // Select the node that will be observed for mutations
  const targetNode = document.querySelector('body');

  // Options for the observer (which mutations to observe)
  const config = { attributes: true, childList: true, subtree: true };

  const targets = ['[aria-label*="trend" i]', '[aria-label*="who to follow" i]'];

  // Callback function to execute when mutations are observed
  const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (let mutation of mutationsList) {
      targets.forEach((target) => {
        const targetedElements = document.querySelectorAll(target);

        if (targetedElements.length > 0) {
          targetedElements.forEach((node) => {
            mutation.target.style.display = 'none';
            console.log(`Remove Twitter Cruft hid selector: "${target}"`);
          });
        }
      });
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
})();
```

Now we can hide any element that we can find an identifier for now!

## Finished TamperMonkey UserScript

Below, we can reference [the final version of our "Remove Twitter Cruft" TamperMonkey UserScript](https://github.com/rmkubik/scripts/blob/master/remove-twitter-cruft.js), metadata and all. I've added a few other sections of Twitter's menu tab I never find myself using.

```jsx
// ==UserScript==
// @name         Remove Twitter Cruft
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove unwanted sections of Twitter
// @author       You
// @match        https://twitter.com/home
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // Select the node that will be observed for mutations
  const targetNode = document.querySelector('body');

  // Options for the observer (which mutations to observe)
  const config = { attributes: true, childList: true, subtree: true };

  const targets = [
    '[aria-label*="trend" i]',
    '[aria-label*="who to follow" i]',
    '[aria-label*="explore" i]',
    '[aria-label*="bookmarks" i]',
    '[aria-label*="lists" i]',
  ];

  // Callback function to execute when mutations are observed
  const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (let mutation of mutationsList) {
      targets.forEach((target) => {
        const targetedElements = document.querySelectorAll(target);

        if (targetedElements.length > 0) {
          targetedElements.forEach((node) => {
            node.style.display = 'none';
            console.log(`Remove Twitter Cruft hid selector: "${target}"`);
          });
        }
      });
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
})();
```

## Take control of your web browsing experience!

A lot of websites these days are designed to capture as much of our attention as possible. While this is great for the companies selling ads, it usually leaves the rest of us with a worse experience. Fortunately, the open nature of the web lets us take some of that control back from companies over our own browsers.

As we saw with TamperMonkey, we can hide unnecessary distractions from our Twitter experience. This is just the tip of the iceberg on what we can do to augment the websites we use. The next time some new feature seems to be sucking more out of you than it's giving back, see if you can flip the tables on it with some well placed JavaScript.
