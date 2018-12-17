---
title: Parse JSON with JQ
date: 2018-09-26T06:16:00.000Z
tags: json, bash, jq
category: til
---

`jq` is a bash program that assists with the parsing of JSON formatted data. This example shows how to log the start script of an npm package to the terminal.

## Quickly view NPM Scripts in a repository

`cat` will print contents of `package.json` to the console.

```bash
cat package.json
{
  "name": "repository",
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --progress --config webpack/prod.js",
    "start": "cross-env NODE_ENV=local webpack-serve --config webpack/dev.js",
  },
  "dependencies": {
    "lodash": "4.17.10"
  }
}
```

If you pipe data into `jq` it will pretty print it with syntax highlighting.

```bash
cat package.json | jq
{
  "name": "repository",
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --progress --config webpack/prod.js",
    "start": "cross-env NODE_ENV=local webpack-serve --config webpack/dev.js",
  },
  "dependencies": {
    "lodash": "4.17.10"
  }
}
```

Finally `jq` lets you parse the JSON via dot notation.

```bash
cat package.json | jq .scripts
{
  "build": "cross-env NODE_ENV=production webpack --progress --config webpack/prod.js",
  "start": "cross-env NODE_ENV=local webpack-serve --config webpack/dev.js",
}

cat package.json | jq .scripts.start
"cross-env NODE_ENV=local webpack-serve --config webpack/dev.js"
```

## sources

https://stedolan.github.io/jq/manual/
