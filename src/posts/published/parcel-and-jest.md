---
title: Using Jest with Parcel Bundler
date: 2018-12-31T07:47:39.303Z
tags: parcel, jest, test, bundle
category: til
---

## What is Parcel?

[Parcel](https://parceljs.org/) is a "zero-configuration" web application bundler. Its a very convenient alternative to a tool called [Webpack](https://webpack.js.org/). Using a bundler for your web application provides a lot of useful features like Hot Module Reloading, ES6 Transpilation, splitting your JavaScript into multiple files, and more. [This article](https://webpack.js.org/concepts/why-webpack/) talks a bit about why to use webpack specifically, but is applicaple to most bundlers.

## What is Jest

[Jest](https://jestjs.io/) is a testing framework that works out of the box as well. It provides the ability to automatically run tests, a fleshed out assertion library, a powerful mocking library and more. Jest also has an emphasis on "zero-configuration" like Parcel.

## Why Jest and Parcel Don't Play Nicely by Default

When attempting to use multiple "zero-configuration" libraries together, you tend to run into edge cases that wind up requiring configuration after all.

By default, Jest is not able to handle transpilation of code. That task is handled by a tool like [Babel](https://babeljs.io/). With a standard Webpack bundled project, you would manually [configure Babel](https://babeljs.io/docs/en/config-files) with a `.babelrc` file. Then you would allow Jest to use that configuration file by installing the NPM Package `babel-jest`. This package will automatically reference a root level `.babelrc` file.

However, because we're using Parcel, transpilation of our ES6 code is already handled for us and we have no Babel configuration.

## Remedying the Lack of Babel Situation

We need to install the following NPM packages to get a development environment with Parcel and Jest up and running.

- `parcel` - our web application bundler
- `jest` - our testing framework
- `babel-jest` - our testing transpilation plugin
- `@babel/core` - our transpilation library
- `@babel/preset-env` - a set of common presets for transpilation

These packages can all be installed as developer dependencies with the following command.

```bash
npm i --save-dev parcel jest babel-jest @babel/core @babel/preset-env
```

Then in the root level of our project we need to create a `.babelrc` file with the following contents.

```json
{
  "presets": ["@babel/preset-env"]
}
```

To run your development, production, and test commands the following scripts in your `package.json` file can be used as a template.

```json
{
  "scripts": {
    "start": "parcel index.html",
    "build": "parcel build index.html",
    "test": "jest --watch"
  }
}
```
