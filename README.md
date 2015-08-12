# Abitbol

[![Build Status](https://travis-ci.org/wanadev/abitbol.svg?branch=master)](https://travis-ci.org/wanadev/abitbol)
[![NPM Version](http://img.shields.io/npm/v/abitbol.svg?style=flat)](https://www.npmjs.com/package/abitbol)
[![License](http://img.shields.io/npm/l/abitbol.svg?style=flat)](https://github.com/wanadev/abitbol/blob/master/LICENSE)


Abitbol is a small Javascript library that provides consistent/easy to use classes. It is heavily inspired by  Armin Ronacher's [Classy][] library, but extends its possibilities.

Built-in functionalities:

* Simple inheritance
* Simple way to call a super class method
* ~~Simple way to declare static properties~~ TODO
* ~~Handful mixin~~ TODO
* ~~Getters and setters~~ TODO

> The classiest javascript class library of the world  
> -- George Abitbol

![George Abitbol](http://pix.toile-libre.org/upload/original/1439302256.png)


## Getting Started

TODO


## Defining Classes

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

## Creating Subclases

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

## Using Your Classes

```javascript
var mustang = new Car("red");
mustang.move(120);
mustang.horn();

var myTruck = new Truck("blue");
myTruck instanceof Car  // true
```


## Class API

### `Class.$extend(properties)`

Creates a new class that extends the given class.

### `Class.$class` / `this.$class`

The class object for this instance.

### `this.$super()`

From a method: invokes the corresponding super class method.

### `this.$name`

From a method: the current method's name.

### `Class.__init__()`

The constructor method.


[Classy]: https://github.com/mitsuhiko/classy
