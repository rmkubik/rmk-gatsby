---
title: Don't Mix React Synthetic Events with Native DOM Events
date: 2020-06-06
tags: javascript, react, synthetic, events, native, DOM, events
category: til
---

I was stuck on a problem for a few days on a side project in React that had me questioning my understanding of how event propagation works in JavaScript. This [article by Gideon Pyzer](https://gideonpyzer.dev/blog/2018/12/29/event-propagation-react-synthetic-events-vs-native-events/) saved my sanity. I'm going to summarize my understanding of this issue here so hopefully I can find this quicker in the future!

## Event Bubbling in the DOM

Plenty of [websites explain how event bubbling (propagation) works in the browser](https://javascript.info/bubbling-and-capturing) better than I can, so I won't go into detail here.

> To greatly summarize, a DOM node will get the chance to respond to an event before its parents do.

Take the example HTML document and JavaScript code below.

```html
<div>
  <button>Click me to trigger a "click" event.</button>
</div>
```

```js
const div = document.querySelector('div');
const button = document.querySelector('button');

div.addEventListener('click', (e) => console.log('Hello from div'));
button.addEventListener('click', (e) => console.log('Hello from button'));
```

Because the button gets to respond to the event first, the console will print out in this order:

```
Hello from button
Hello from div
```

### Stopping event propagation

Sometimes, you don't want a parent node to also respond to an event. JavaScript events have a [stopPropagation](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation) function on them to prevent any nodes further along in the bubble chain from receiving the event.

Let's update the button event handler in the JavaScript code from above to the following:

```js
button.addEventListener('click', (e) => {
  e.stopPropagation();
  console.log('Hello from button');
});
```

The button event handler now prevents the event from propagating up to the body event listener so our console output looks like this:

```
Hello from button
```

## Events in React

### Mixing DOM events and React Synthetic Events

Recently, I was creating a React app where I wanted to listen to global `click` events. To accomplish this, I was listening for click events on the body when my App mounted. Additionally, I wanted buttons to be able to override the default global behavior. Below is a sample React app I thought would accomplish these things.

```js
const App = () => {
  useEffect(() => {
    // attach a click event listener to the body of the HTML document when App "mounts"
    document.body.addEventListener('click', (e) =>
      console.log('Hello from body, default behavior'),
    );
  }, []);

  return (
    <div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          console.log('Hello from button, special behavior');
        }}
      >
        Click me to trigger a "click" event.
      </button>
    </div>
  );
};
```

The App mounts a body event listener with my default global behaviour. My button stops event propagation to allow it to trigger unique behavior and avoid the default behavior. I thought this would behave in the same way as the traditional DOM events in the previous sections. However, when I clicked the button I saw the following unexpected response:

```
Hello from div, default behavior
Hello from button, special behavior
```

My call to `stopPropagation` didn't seem to be working! Both behaviors were still being triggered, and weirdly they weren't even being triggered in the order that I expected them to be occuring. After much googling and experimenting I learned why this had happened once I found [Gideon Pyzer's blog post](https://gideonpyzer.dev/blog/2018/12/29/event-propagation-react-synthetic-events-vs-native-events/).

### Synthetic Events

React doesn't use the same DOM events that the browser uses. Instead it uses something called [Synthetic Events](https://reactjs.org/docs/events.html) that have a similar API to native DOM events. These events have optimizations and allow for a cross compatability layer for use with different React renderers like React Native.

Because these Synthetic Events are a React construct, the `onClick` handler I set on the `button` component above is not a true DOM event like I originally assumed, it's a synthetic event. React doesn't guarantee that stopping propagation in a synthetic event will prevent native DOM events from propagating.

### Refactor to use synthetic events only

There's not a default way to actually listen to all click events in the body via React. Instead, you can attach an `onClick` listener to the root element in your React component tree. When clicking on the button, the below code will log out as we expected it to earlier.

```js
const App = () => {
  return (
    <div onClick={(e) => console.log('Hello from body, default behavior')}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          console.log('Hello from button, special behavior');
        }}
      >
        Click me to trigger a "click" event.
      </button>
    </div>
  );
};
```

```
Hello from button, special behavior
```

### Don't Mix Synthetic Events and Native DOM Events

Based on this information, my recommendation is not to use DOM events and synthetic events that rely on each other. A safer rule of thumb is probably:

> Always use React's synthetic events instead of native DOM events.

There may be scenarios where it makes sense to mix DOM events in. But generally, React's role is to prevent you from needing to interact directly with the DOM. If you find yourself doing so, there's a chance you might run into some unexpected behavior where React cannot correctly optimize itself for you.
