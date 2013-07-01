# grunt-typescript-export

Generates a single `index.d.ts` file for your NPM package implemented in TypeScript by concatenating per-file d.ts files, wrapping them all into an implicit module declaration and rewriting/moving some lines.

Produces something like this:

```typescript
/// <reference path="./d.ts/DefinitelyTyped/node/node.d.ts" />

declare module "livereload-soa" {

import events = require('events');
import api = require('./api');

// lib/api.d.ts
export interface Service {
    onmessage(message: Message): void;
    ondisconnect(): void;
}

// lib/carrier-node-stream.d.ts
export class NodeStreamCarrier extends events.EventEmitter {
    constructor(input, output);
    public send(message): void;
}

}
```


## Getting Started

This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-typescript-export --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-typescript-export');
```

## The "typescript_export" task

### Overview

In your project's Gruntfile, add a section named `typescript_export` to the data object passed into `grunt.initConfig()`, and also make sure you set `pkg.name`.

```js
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),

  typescript_export: {
    your_target: {
      src: ['lib/*.d.ts'],
      dest: 'index.d.ts'
    },
  },
})
```

### Options

None so far.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
