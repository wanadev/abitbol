---
title: Using Abitbol
autotoc: true
menuOrder: 2
---

# Using Abitbol


## Getting Abitbol

### Standalone Version (browser)

To use the standalone version, first [download the latest zip][dl-zip] or clone
the git repository:

    git clone https://github.com/wanadev/abitbol.git

Then, just include one of the javascript of the `dist/` folder:

```html
<script src="dist/abitbol.js"></script>
```

### NPM

To use Abitbol with Node.js (or in the browser using [Browserify][]), first
install the library:

    npm install --save abitbol

Then require it when needed:

```javascript
var Class = require("abitbol");
```


## Getting Started

### Defining a Class

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

### Subclassing

```javascript
var Car = Vehicle.$extend({

    __init__: function(color) {
        this.$super(color);
        this.maxSpeed = 180;
    },

    move: function(speed) {
        speed = Math.min(speed, this.maxSpeed);
        this.$super(speed);
    },

    horn: function() {
        alert("BEEP BEEP");
    }

});

var Truck = Car.$extend({

    __init__: function(color) {
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
myTruck instanceof Car;           // true
```





## Computed Properties (Getters and Setters)

Abitbol allows you to create computed properties simply by defining getters
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

## Annotations

Abitbol classes support annotations. To add annotations, just define them in
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

The annotations are accessible through the [`Class.$map`][class-map] object:

```javascript
console.log(MyClass.$map.methods.myMethod.annotations);

// {
//     annotation1: "value",
//     annotation2: true
// }
```

> **WARNING when using minification:** Since **v3.4**, **UglifyJS** has a new
> compress option, `directives`, that is enabled by default when compressor is
> enabled. This option breaks Abitbol annotations (it removes the annotations 
> in the minified version of the code). You should disabled it if you want to
> use annotations.
> ex: `uglifyjs index.js --compress directives=false`


[dl-zip]: https://github.com/wanadev/abitbol/archive/master.zip
[Browserify]: http://browserify.org/

[class-map]: ./class-api.html#class-map
