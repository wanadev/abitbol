# Abitbol

[![Lint and Test](https://github.com/wanadev/abitbol/actions/workflows/node-ci.yml/badge.svg)](https://github.com/wanadev/abitbol/actions/workflows/node-ci.yml)
[![NPM Version](http://img.shields.io/npm/v/abitbol.svg?style=flat)](https://www.npmjs.com/package/abitbol)
[![License](http://img.shields.io/npm/l/abitbol.svg?style=flat)](https://github.com/wanadev/abitbol/blob/master/LICENSE)
[![Discord](https://img.shields.io/badge/chat-Discord-8c9eff?logo=discord&logoColor=ffffff)](https://discord.gg/BmUkEdMuFp)


Abitbol is a small Javascript library that provides consistent/easy to use
classes for Node.js and web browsers. It is heavily inspired by  Armin
Ronacher's [Classy][] library, but extends its possibilities.

**Features:**

* Simple inheritance
* Consistent `this` (always points to the current instance)
* Annotations
* Computed properties automatically generated from getters and setters
* Simple way to call a super class method
* Simple way to declare static properties
* Handful mixin

**Exemple class definition:**

```javascript
var Vehicle = Class.$extend({

    __init__: function(color) {
        this.color = color;
        this.speed = 0;
    },

    move: function(speed) {
        this.speed = speed;
    },

    stop: function() {
        this.speed = 0;
    }

});
```

![George Abitbol](./doc/images/george-abitbol.jpg)

> The classiest javascript class library of the world<br />
> -- George Abitbol


## Install

To install Abitbol run the following command:

    npm install abitbol


## Documentation

* https://wanadev.github.io/abitbol/


## Contributing

### Questions

If you have any question, you can:

* [Open an issue on GitHub][gh-issue]
* [Ask on discord][discord]

### Bugs

If you found a bug, please [open an issue on Github][gh-issue] with as much information as possible.

### Pull Requests

Please consider [filing a bug][gh-issue] before starting to work on a new feature. This will allow us to discuss the best way to do it. This is of course not necessary if you just want to fix some typo or small errors in the code.

### Coding Style / Lint

To check coding style, run the follwoing command:

    npx grunt lint

### Tests

Tu run tests, use the following command:

    npx grunt test

### Build For Browsers

To generate browser version of the lib (files in the `dist/` folder), run:

    npx grunt


[gh-issue]: https://github.com/wanadev/abitbol/issues
[discord]: https://discord.gg/BmUkEdMuFp


## Changelog

* **[NEXT]** (changes on master that have not been released yet):

    * Nothing yet ;)

* **v2.1.1:**

    * Updated dev dependencies (@jbghoul, #34)

* **v2.1.0:**

    * Added TypeScript type definitions (@jbghoul, #26)

* **v2.0.1:**

    * Optimization of special properties detection (@jbghoul, #23)

* **v2.0.0:**

    * New pre/post build hooks that allows to implement new patterns on Abitbol Classes.

* **v1.2.0:**

    * Support static method/properties in mixin

* **v1.1.1**:

    * Updates doc and README

* **v1.1.0**:

    * Adds ES2015 support in the annotation parser

* **v1.0.4**:

    * Updates dependencies

* **v1.0.3**:

    * Allows computed properties' accessors and mutators to be monkey-patched.

* **v1.0.2**:

    * Do not wrap methods when it is not necessary.

* **v1.0.1**:

    * Fixes context issue with nested method calls.

* **v1.0.0**:

    * Computed properties generated from accessors and mutators (get/set), annotations, proper `this`.

* **v0.1.0**:

    * Equivalent to Classy (except `Class.$classyVersion`, `Class.$withData()`, `Class.$noConflict()` that are not implemented).


[Classy]: https://github.com/mitsuhiko/classy
[dl-zip]: https://github.com/wanadev/abitbol/archive/master.zip
