var Class = require("../src/abitbol.js");

//
// This class can serialize:
//
// * its attributes
// * its computed properties (if there is both a getter and a setter)
//
// computed properties whose getter or setter contains the following annotation are skipped:
//
//     "@serializable false"
//

var SerializableClass = Class.$extend({
    __init__: function (params) {
        for (var propertyName in params || {}) {
            if (this.$map.computedProperties[propertyName] || this.$map.attributes[propertyName]) {
                this[propertyName] = params[propertyName];
            }
        }
    },

    serialize: function () {
        var result = {};

        for (var attributeName in this.$map.attributes) {
            result[attributeName] = this[attributeName];
        }

        for (var computedPropertyName in this.$map.computedProperties) {
            if (this.$map.computedProperties[computedPropertyName].get &&
                this.$map.computedProperties[computedPropertyName].set &&
                this.$map.computedProperties[computedPropertyName].annotations.serializable !== false
            ) {
                result[computedPropertyName] = this[computedPropertyName];
            }
        }

        return result;
    }
});

//
// Example of serializable class implemented using the SerializableClass above.
//

var Person = SerializableClass.$extend({

    _class: "Person",

    // -> this.firstName computed property

    getFirstName: function () {
        return this.$data.firstName;
    },

    setFirstName: function (value) {
        this.$data.firstName = String(value);
    },

    // -> this.lastName computed property

    getLastName: function () {
        return this.$data.lastName;
    },

    setLastName: function (value) {
        this.$data.lastName = String(value);
    },

    // -> this.fullName computed property (read-only, not serialized)

    getFullName: function () {
        return this.$data.firstName + " " + this.$data.lastName;
    },

    // -> this.heightCentimeter computed property

    getHeightCentimeter: function () {
        return this.$data.height;
    },

    setHeightCentimeter: function (value) {
        this.$data.height = Number(value);
    },

    // -> this.heightInch computed property (not serialized)

    getHeightInch: function () {
        "@serializable false";
        return this.heightCentimeter * 0.394;
    },

    setHeightInch: function (value) {
        this.heightCentimeter = Number(value) * 2.54;
    }
});

//
// Now we can play with our Person class
//

var george = new Person();
george.firstName = "George";
george.lastName = "Abitbol";
george.heightCentimeter = 192;

console.log(george.fullName);    // "George Abitbol"
console.log(george.heightInch);  // 75.648

console.log(george.serialize());
// {
//     _class: "Person",
//     firstName: "George",
//     lastName: "Abitbol",
//     heightCentimeter: 192
// }

// We can also easily clone george

var clone = new Person(george.serialize());

console.log(clone.serialize());
// {
//     _class: "Person",
//     firstName: "George",
//     lastName: "Abitbol",
//     heightCentimeter: 192
// }
