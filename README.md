# Custom esm loader

Custom loader for ESM modules. You need [node](https://nodejs.org/en/) 20 or upper.

## Why?

We know that [ESM Modules](https://nodejs.org/api/esm.html) are very different to [CommonJs](https://nodejs.org/api/modules.html) and one of the things that changes too much is the imports's path. For example:

```javascript
import something from './file' // this won't work
```
This import path will work in CommonJs but in ESM no. The correct form is:
```javascript
import something from './file.js' // this will work
```
Some parsers like Typescript don't follow well this standard, and for some editors is uncorfortable to change the imports to add the .js extension. Also, the directories import in ESM not exist. For example:

```javascript
// src/module/index.js
export const name = 'module'
```
```javascript
// src/main.js
import { name } from './module' // this won't work
```
Again in CommonJs this import path will work, but in ESM no. The correct form is:
```javascript
// src/main.js
import { name } from './module/index.js' // this will work
```
Both cases could be very confused and uncomfortable for many developers, because in environments like [Vite](https://vitejs.dev/), [webpack](https://webpack.js.org/), [swc](https://swc.rs/), [Typescript](https://www.typescriptlang.org/), and others is not necessary to add .js or specify the index.js. 

Another problem when you use ESM Modules is the definitions of __dirname, __filename, require. This global variables exist on CommonJs, but in ESM no. If you try to get one of this varaibles, you will get an error like this:

```bash
ReferenceError: __dirname is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension and 'E:\Daniel-Pc\Dev-Pro\nodejs\test-loader-import-\package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
    at file:///E:/Daniel-Pc/Dev-Pro/nodejs/test-loader-import-/dist/main.js:3:13
    at ModuleJob.run (node:internal/modules/esm/module_job:218:25)
    at async ModuleLoader.import (node:internal/modules/esm/loader:329:24)
    at async loadESM (node:internal/process/esm_loader:28:7)
    at async handleMainPromise (node:internal/modules/run_main:113:12)

Node.js v20.11.0
```

## How?

For that reason is possible to modify the path resolver to solvent this problem and use ESM with more flexibility. With this loader you don't have to set .js and index.js to imports, node can load all of this paths. And you can use __dirname, __filename and require. You only have to modify the script for run the project (in the example you can see how you have to set it). If you apply the loader to previous examples:

Single file import:
```javascript
import something from './file' // this will work with the loader
```
Directory import:
```javascript
// src/main.js
import { name } from './module' // this will work with the loader
```
Internal node valiables:

```javascript
// All of this variables work with the loader, you don't have to set it manually
__dirname
__filename
require

// Also import.meta will include it
import.meta.filename // The same of __filename
import.meta.dirname // The same of __dirname
```

---
**NOTE**

This variables would be created in the project files, third libraries won't be modified.

---

## Installation

Use the package manager [npm](https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager) to install custom-esm-leader.

```bash
npm i esm-import-loader
```
or by [pnpm](https://pnpm.io/)

```bash
pnpm add esm-import-loader
```

## Usage

You must to put on your start script like this:

```bash
node --import esm-import-loader <entry file>
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://github.com/danixl30/custom-esm-loader/blob/main/LICENSE)
