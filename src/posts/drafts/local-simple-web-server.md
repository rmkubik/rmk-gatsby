---
title: Host a simple local web server using http-server
date: 2018-12-20T04:57:02.568Z
tags: javascript, local, web, server, http, server, localhost, node, npm
category: til
---

Sometimes when you're developing a application it can be helpful to run your project on a web server. Often running that server on your local machine is easier and faster during development. It lets you avoid uploading your work in progress files and setting up a complex build system.

## Enter `http-server`.

From their [documentation page](https://www.npmjs.com/package/http-server):

> `http-server` is a simple, zero-configuration command-line http server. It is powerful enough for production usage, but it's simple and hackable enough to be used for testing, local development, and learning.

### Install Node.js & NPM

[This link](https://www.npmjs.com/get-npm) will instruct you on how to get up and running with Node.js and NPM.

Verify you've got both installed correctly by running the following commands in my terminal.

  ```js
  node -v
  ```

  ```js
  npm -v
  ```

### Install `http-server`

To install the package globally, using Node Package Manager (npm), run the following command in your terminal:

    npm install -g http-server

To use the web server, navigate to the directory that you wish to host a server in. Then run the following command:

    http-server

This will host a web server at the address echoed into your terminal. Copy and paste that URL into your browser to view it.

### Fine tuning

There are several helpful options you can use with http-server. We'll use the following couple:

- `-s` The silent flag will suppress log messages from output. This hides all the noisy debug messages you saw in your terminal.
- `-o` This flag will open your web browser to the appropriate URL after the server starts running.

Our final command:

    http-server -so