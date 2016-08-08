# Abitbol

[![Build Status](https://travis-ci.org/wanadev/abitbol.svg?branch=master)](https://travis-ci.org/wanadev/abitbol)
[![NPM Version](http://img.shields.io/npm/v/abitbol.svg?style=flat)](https://www.npmjs.com/package/abitbol)
[![License](http://img.shields.io/npm/l/abitbol.svg?style=flat)](https://github.com/wanadev/abitbol/blob/master/LICENSE)
![Dependencies](https://img.shields.io/david/wanadev/abitbol.svg?maxAge=2592000)
![Dev Dependencies](https://img.shields.io/david/dev/wanadev/abitbol.svg?maxAge=2592000)


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

> The classiest javascript class library of the world
> -- George Abitbol

![George Abitbol](http://pix.toile-libre.org/upload/original/1439302256.png)


## Getting Started

### Standalone Version (browser)

To use the standalone version, first [download the latest zip][dl-zip] or clone
the git repository:

    git clone https://github.com/wanadev/abitbol.git

Then, just include one of the javascript of the `dist/` folder:

```html
<script src="dist/abitbol.js"></script>
```

### NPM

To use Abitbol with Node.js (or in the browser using Browserify), first install
the library:

    npm install --save abitbol

Then require it when needed:

```javascript
var Class = require("abitbol");
```


## Using Abitbol

### Defining Classes

```javascript
var Vehicle = Class.$extend({
    __init__: function (color) {
        this.color = color;
        this.speed = 0;
    },

    move: function (speed) {
        this.speed = speed;
    },

    stop: function () {
        this.speed = 0;
    }
});
```

### Creating Subclases

```javascript
var Car = Vehicle.$extend({
    __init__: function (color) {
        this.$super(color);
        this.maxSpeed = 180;
    },

    move: function (speed) {
        speed = Math.min(speed, this.maxSpeed);
        this.$super(speed);
    },

    horn: function () {
        alert("BEEP BEEP");
    }
});

var Truck = Car.$extend({
    __init__: function (color) {
        this.$super(color);
        this.maxSpeed = 90;
    },

    horn: function () {
        alert("HONK HONK");
    }
});
```

### Using Your Classes

```javascript
var mustang = new Car("red");
mustang.move(120);
mustang.horn();

var myTruck = new Truck("blue");
myTruck instanceof Car  // true
```


### Computed Properties (Getters and Setters)

Abitbol allows you to creates computed properties simply by defining getters
and setters:

```javascript
var Person = Class.$extend({

    // This will create the Person.fullName property

    getFullName: function () {
        return this.$data.fullName;
    },

    setFullName: function (value) {
        this.$data.fullName = value;
    },

    // This will create the Person.age property

    getAge: function () {
        return this.$data.age;
    },

    setAge: function (value) {
        this.$data.age = value;
    },

    // This will create the read-only Person.old property

    isOld: function () {
        return (this.age > 75);
    },

    // This will create the read-only Person.woodenLeg property

    hasWoodenLeg: function () {
        return (this.fullName == "Long John Silver");
    }
})
```

and playing with those properties is straightforward:

```javascript
var george = new Person();

george.fullName = "George Abitbol";
george.age = 50;

console.log(george.fullName);       // "George Abitbol"
console.log(george.getFullName());  // "George Abitbol"
console.log(george.old);            // false
console.log(george.isOld());        // false

george.setAge(80);

console.log(george.old);            // true
```

### Annotations

Abitbol classes supports annotations. To add annotations, just defines them in
non-assigned strings **at the top** of the function:

```javascript

var MyClass = Class.$extend({
    myMethod: function () {
        "@annotation1 value";
        "@annotation2";

        // ... Method's code here
    }
});
```

The annotations are accessible through the `Class.$map` object:

```javascript
console.log(MyClass.$map.methods.myMethod.annotations);

// {
//     annotation1: "value",
//     annotation2: true
// }
```

see the documentation about the `Class.$map` object bellow for more
informations.


### Class API

#### `Class.$extend(properties)`

Creates a new class that extends the given class.

#### `Class.$class` / `this.$class`

The class object for this instance.

#### `this.$super()`

From a method: invokes the corresponding super class method.

#### `this.$name`

From a method: the current method's name.

#### `this.$computedPropertyName`

From a getter/setter method: the name of the related computed property.

#### `Class.$map` / `this.$map`

An object that contains the class' map (list of methods, attributes,...).

```javascript
{
    attributes: {
        attr1: true,
        attr2: true,
        ...
    },
    methods: {
        meth1: {
            annotations: {
                key: "value"
            }
        },
        meth2: {
            annotations: {}
        },
        ...
    },
    computedProperties: {
        prop1: {
            get: "getProp1",
            set: "setProp1",
            annotations: {
                key: "value"
            }
        },
        prop2: {
            get: "isProp2",
            annotations: {}
        },
        ...
    }
}
```

#### `this.$data`

An object to store ~~private~~ internal properties (to store computed
properties' values for example).

#### `Class.__init__()`

The constructor method.

#### `Class.__include__`

A list of objects that contains properties to mix in the class.

```javascript

var Boat = Vehicle.$extend({
    __include__: [{
        horn: Truck.prototype.horn
    }],

    navigate: function (speed) {
        this.move(speed);
    }
});
```

#### `Class.__classvars__`

An object containing static properties of the class.

```javascript
var MyClass = Class.$extend({
    __classvars__: {
        staticAttribute: "value",
        staticMethod: function () {}
    }
});
```

## Autocompletion using Tern

If you use [Tern.js][tern] to autocomplete your javascript, you will need the
[tern-abitbol][] plugin.

[tern-abitbol]: https://www.npmjs.com/package/tern-abitbol
[tern]: http://ternjs.net/


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
[dl-zip]: https://github.com/wanadev/abitbol/archive/master.zip
