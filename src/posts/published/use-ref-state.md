---
title: 🎣 useRefState Hook - Access state outside of a component
date: 2019-09-03
tags: useRef, useState, hook, react, state, ref, current
category: til
---

## What's the current state?

I ran into a situation where I needed to use the value state of a `useState` hook inside an event handler callback. The callback would execute later on after an event was triggered. By this time, the value of my state would have changed. This is where my trouble began.

I was passing a simple constant variable into the callback that was not a React component. This callback was unaware that my state value had been changed.

```js
const ComponentWithEvent = () => {
  const [state, setState] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      console.log(state); // this will log 0
    }, 100);
  }, []);

  setState(1);
};
```

## Enter useRef

`useRef` allows us to create an object that contains a reference to any variable on the ref's `current` property. This value will be persisted across React re-renders. We'll pass this ref to our callback now instead of the value itself.

Now our callback has a reference that we can update from React, but we need code to actually do the updating!

```js
const ComponentWithEvent = () => {
  const [state, setState] = useState(0);
  const stateRef = useRef(state);

  useEffect(() => {
    setTimeout(() => {
      console.log(stateRef.curent); // this will still log 0 :-(
    }, 100);
  }, []);

  setState(1);
};
```

## Enter useEffect

`useEffect` will let us run code when the variables being watched by the useEffect hook are altered. In this case, we will watch the `state` variable being created by our original `useState` hook.

Now, every time that our `state` variable changes we will update our `stateRef` to keep the value referenced by our callback up to date.

```js
const ComponentWithEvent = () => {
  const [state, setState] = useState(0);
  const stateRef = useRef(state);
  useEffect(
    () => {
      stateRef.current = state;
    },
    [state],
  );

  useEffect(() => {
    setTimeout(() => {
      console.log(stateRef.curent); // this will still log 1!!!
    }, 100);
  }, []);

  setState(1);
};
```

## Our custom useRefState hook

Putting this all together, we end up with a custom `useRefState` hook! This will allow us to reuse this logic anywhere we need it in the future!

### Custom hook code

```js
const useRefState = (initialValue) => {
  const [state, setState] = useState(initialValue);
  const stateRef = useRef(state);
  useEffect(
    () => {
      stateRef.current = state;
    },
    [state],
  );
  return [stateRef, setState];
};
```

### Using the hook

```js
const ComponentWithEvent = () => {
  const [stateRef, setState] = useRefState(0);

  useEffect(() => {
    setTimeout(() => {
      console.log(stateRef.curent);
    }, 100);
  }, []);

  setState(1);
};
```

## Credit where it's due!

My original `useRefState` hook implementation, actually extended the `setState` function of `useState` to keep the stateRef up to date. However, I found [an excellent post by Sébastien Castiel](https://blog.castiel.me/posts/2019-02-19-react-hooks-get-current-state-back-to-the-future/) that used this much more elegant `useEffect` approach.
