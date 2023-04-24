---
title: Home
autotoc: false
menuOrder: 0
---

**Abitbol** is a small Javascript library that provides consistent / easy to use
classes for Node.js and web browsers. It is heavily inspired by  Armin
Ronacher's [Classy][] library, but extends its possibilities.

![George Abitbol](./images/george-abitbol.jpg)

> The classiest javascript class library of the world<br />
> -- George Abitbol

**Features:**

* Simple inheritance
* Consistent `this` (always points to the current instance)
* Annotations
* Computed properties automatically generated from getters and setters
* Simple way to call a super class method
* Simple way to declare static properties
* Handy mixin

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

## Changelog

* **1.1.0**: Adds ES2015 support in the annotation parser
* **1.0.4**: Updates dependencies
* **1.0.3**: Allows computed properties' accessors and mutators to be
  monkey-patched.
* **1.0.2**: Do not wrap methods when it is not necessary.
* **1.0.1**: Fixes context issue with nested method calls.
* **1.0.0**: Computed properties generated from accessors and mutators
  (get/set), annotations, proper `this`.
* **0.1.0**: Equivalent to Classy (except `Class.$classyVersion`,
  `Class.$withData()`, `Class.$noConflict()` that are not implemented).


[Classy]: https://github.com/mitsuhiko/classy
