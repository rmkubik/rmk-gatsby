---
title: 'Making a Custom Parcel Watch Task'
date: 2019-10-29
tags: parcel, custom, watch, build, tasks, automation, augment, jscodeshift, code, mod, modification, extend
---

## Extending Parcel for Rapid Prototyping

Parcel is a "no-configuration" build tool and code bundler. Its very convenient for getting a new web game project up and running quickly. I use it often, and was recently using it to build [my React-powered game prototype called Rountable](https://round-table.netlify.com/). Frequently, however, no configuration means that its challenging (or impossible) to extend the tool.

This project had a series of level files in a `levels` directory. I created a `list.js` file that imports my levels as a JavaScript module to use them in my game. I had to update this file manually every time I created a new level.

Here's what `list.js` looked like:

```js
import level1 from '../../assets/levels/level1.yaml';
import level2 from '../../assets/levels/level2.yaml';
import level3 from '../../assets/levels/level3.yaml';

export default { level1, level2, level3 };
```

This process was an annoying, repetitive task I had to go through with every new level. I really wanted to be able to dynamically import all my level files instead. As far as I'm aware though (which means it might exist somewhere, maybe in a community plugin) there is no way to dynamically import all files in a directory as a JavaScript module in Parcel.

## Dynamically Generate JavaScript Code with JSCodeShift

Since Parcel's module system doesn't seem to support a dynamic import like I wanted, I decided to dynamically write my module file instead. To do this I leveraged a tool called `jscodeshift` that allows you to programmatically write JavaScript source code. It's often used to write code mods in the JavaScript community.

### Abstract Syntax Trees

JSCodeShift relies on a concept called the [Abstract Syntax Tree (AST)](https://astsareawesome.com/#introducing-the-ast). The AST is a data structure that describes the parsed state of a section of code. It's made up of a series of nodes, each of which have various child nodes. This tree forms a similar structure to the [DOM (Document Object Model)](https://en.wikipedia.org/wiki/Document_Object_Model).

The DOM has nodes of various types that describe an HTML page (`div`, `p`, `body`, etc). Instead of a web document, the AST's nodes describe sections of code using types like `Literal`, `FunctionDeclaration`, and `IfStatement`. Each of these node types has a specific set of properties to which it must conform. You can find these types defined in the the [ast-types library on Github](https://github.com/benjamn/ast-types/blob/master/def/core.ts).

### Builder Functions

`jscodeshift` provides functions that help you create AST nodes without knowing every last property required. They call these "builder functions". We'll be using them to build create an Abstract Syntax Tree that represents our JavaScript module.

The builder functions use the types defined in the `ast-types` library as well. These types specify zero or more required fields needed to build an AST node.

There are two basic building block AST Nodes:

- `identifier` - represents something like a variable name
- `literal` - represents a literal value in JavaScript

Apart from these two AST Nodes, an AST Node's fields will generally be another type of AST Node and you'll need to look up the appropriate builder function.

### JavaScript Module Creation Script

```js
const j = require('jscodeshift');

// array representing our yaml level files
// we will dynamically generate this later
const fileEntries = [
  {
    key: 'level1',
    filePath: '../../assets/levels/level1.yaml',
  },
  {
    key: 'level2',
    filePath: '../../assets/levels/level2.yaml',
  },
  {
    key: 'level3',
    filePath: '../../assets/levels/level3.yaml',
  },
];

const createLevelsModule = (fileEntries) => {
  try {
    // Build import declarations
    const imports = fileEntries.map(({ key, filePath }) =>
      // Create one import statement for each file
      j.importDeclaration(
        // Left side of the import declaration
        [j.importDefaultSpecifier(j.identifier(key))],
        // Right side of the import declaration
        j.literal(filePath),
      ),
    );

    // Build an array of object properties to create our export object
    const exports = fileEntries.map(({ key }) => {
      // Create one export statement for each file
      const exportStatement = j.objectProperty(
        // Left side of the import statement
        j.identifier(key),
        // Right side of the import statement
        j.identifier(key),
      );
      // We're generating the ESNext shorthand styled export so
      // we need to enable this flag.
      exportStatement.shorthand = true;

      return exportStatement;
    });

    // We're using the default export, so there's only one actual
    // export declaration.
    const defaultExportObject = j.exportDefaultDeclaration(
      // The object we're exporting
      j.objectExpression(exports),
    );

    // Build ast with jscodeshift. The Program node is the root of
    // all jscodeshift ASTs.
    const program = j.program([...imports, defaultExportObject]);
    // We use jscodeshift's default function to create an AST Node
    const root = j(program);
    // Convert the AST to source code
    const moduleSourceCode = root.toSource();

    console.log(moduleSourceCode);
  } catch (err) {
    console.error(err);
  }
};
```

## Generate a list of files

### **Get the files**

Use `fs` promises api to read all the files in our events directory. Then we map these files into the `fileEntries` array we used in the above example.

### **Create the file key**

We use `lodash.camelCase()` on our files' names because the `baseName` may not be safe to make into a JavaScript variable later on.

Lodash is a popular utility library you can install via npm. Be careful shipping the entire library with your client side code. It can be a lot of extra code to ship if you're only using a small fraction of its utility. Because this is a build script and we're not shipping any of this code to our users, we should be fine!

### **Figure out the file path**

We use `path.relative` to ensure we're importing our level files relative to our output directory.

```js
const fs = require('fs').promises;
const path = require('path');
const camelCase = require('lodash/camelCase');

const EVENTS_DIR = './assets/events';
const OUTPUT_DIR = './src/events';

const getFileEntries = async () => {
  // Read all files in the eventsDir
  const files = await fs.readdir(EVENTS_DIR);

  // Get their names and file paths relative to the ouput directory
  return files.map((file) => {
    const baseName = path.basename(file, '.yaml');
    const safeName = camelCase(baseName);
    const fullFilePath = `${EVENTS_DIR}/${file}`;
    const pathRelativeToOutput = path.relative(OUTPUT_DIR, fullFilePath);

    return {
      key: safeName,
      filePath: filePathRelativeToOutputDir,
    };
  });
};
```

We can now dynamically generate a list of files and then write those files into a JavaScript module. The final piece of the puzzle is running this code automatically!

## Watching for Added & Removed Files

Phaser is only aware of files that have been imported into the dependency tree from its entry point file. This means Parcel is not aware of new files being created in your file system until you actually import them.

Enter the npm module: `watch`. This module will allow you to watch a directory and then fire events when files are created, changed, or removed. For our purposes we'll need the created and removed events.

    const watch = require("watch");

    const buildModule = async () => {
    		const fileEntries = await getFileEntries();
        createLevelsModule(fileEntries);
    }

    watch.createMonitor("EVENTS_DIR", (monitor) => {
      monitor.on("created", buildModule);
      monitor.on("removed", buildModule);
    });

## Tying it all together

We'll update our `package.json` to run both our original build command and our new module file builder when we use `npm start`.

We need three total commands.

`dev:watch` - This is our normal development watch command using Parcel.

`dev:watchEventFiles` - This is our new command that runs our custom module building watch task

`start` - This is our new start command. It uses an npm module called `npm-run-all`. This module provides the command `run-p` meaning "run parallel". This lets you run all the provided tasks at the same time. This library also supports pattern matching so we've chosen to run all npm tasks starting with `dev:`.

    {
    	"scripts": {
    		"start": "run-p dev:*",
        "dev:watch": "parcel src/index.html",
        "dev:watchEventFiles": "node tasks/importEvents",
    	}
    }
