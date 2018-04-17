---
title: Abitbol Class API
autotoc: true
menuOrder: 3
---

# Abitbol Class API

## Class Special Properties

### Class.`__`init`__`()

The constructor method.

### Class.`__`include`__`

A list of objects that contain properties to mix in the class.

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

### Class.`__`classvars`__`

An object containing static properties of the class.

```javascript
var MyClass = Class.$extend({
    __classvars__: {
        staticAttribute: "value",
        staticMethod: function () {}
    }
});
```

### Class.`__`preBuild`__` and Class.`__`postBuild`__`

Those static methods are hooks that are called at the beginning
(`__preBuild__`) and at the end (`__postBuild__`) of the Class building
process.

These methods can be used to mutate the generated class (modifying properties,
implementing new patterns, and so on).

Please note that those methods are inherited like any other properties. Also
note that these methods are called without the usual Abitbol context (no `this`, nor
`this.$super()`).

```javascript
var Boat = Vehicle.$extend({
    __preBuild__: function (properties, NewClass, SuperClass) {
        // Mutates the properties before they are analysed by abitbol
        properties.isNice = function () {
            return true;
        }
    }
});
```

## Static Methods and Attributes

### Class.$extend(properties)

Creates a new class that extends the current class.

### Class.$class

A reference to the current class.

### Class.$map

An object that contains the class' map (list of methods, attributes,...).

```javascript
{
    attributes: {
        attr1: true,
        attr2: true,
        // ...
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
        // ...
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
        // ...
    }
}
```

## Instance Properties

### classInstance.$class

See [`Class.$class`](#class-class) above.

### classInstance.$map

See [`Class.$map`](#class-map) above.


## Instance Internal Methods and Properties

### this.$super()

From a method: invokes the corresponding super class' method.

### this.$name

From a method: the current method's name.

### this.$computedPropertyName

From a getter / setter method: the name of the related computed property.

### this.$data

An object to store ~~private~~ internal properties (to store computed
properties' values for example).
