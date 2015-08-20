"use strict";

var extractAnnotations = require("./annotation.js");

var _disableConstructor = false;

// Inherit from a class without calling its constructor.
function inherit(SuperClass) {
    _disableConstructor = true;
    var __class__ = new SuperClass();
    _disableConstructor = false;
    return __class__;
}

// Checks if the given function uses abitbol special properties ($super, $name,...)
function usesSpecialProperty(fn) {
    return Boolean(fn.toString().match(/.*(\$super|\$name|\$computedPropertyName).*/));
}

var Class = function () {};

Object.defineProperty(Class, "$class", {
    enumerable: false,
    value: Class
});

Object.defineProperty(Class, "$map", {
    enumerable: false,
    value: {
        attributes: {},
        methods: {},
        computedProperties: {}
    }
});

Object.defineProperty(Class, "$extend", {
    enumerable: false,
    value: function (properties) {
        var _superClass = this;
        var _classMap = JSON.parse(JSON.stringify(_superClass.$map));  // not pretty :s

        // New class
        var __class__ = function () {
            if (_disableConstructor) {
                return;
            }
            // Abitbol special properties
            Object.defineProperty(this, "$class", {
                enumerable: false,
                value: __class__
            });
            Object.defineProperty(this, "$map", {
                enumerable: false,
                value: _classMap
            });
            Object.defineProperty(this, "$data", {
                enumerable: false,
                value: {}
            });
            // Computed properties
            for (var property in _classMap.computedProperties) {
                Object.defineProperty(this, property, {
                    enumerable: true,
                    configurable: false,
                    get: (_classMap.computedProperties[property].get !== undefined) ? (function (accessorName) {
                        return function () {
                            return this[accessorName].apply(this, arguments);
                        };
                    })(_classMap.computedProperties[property].get) : undefined,  // jshint ignore:line
                    set: (_classMap.computedProperties[property].set !== undefined) ? (function (mutatorName) {
                        return function () {
                            return this[mutatorName].apply(this, arguments);
                        };
                    })(_classMap.computedProperties[property].set) : undefined   // jshint ignore:line
                });
            }
            // Bind this
            for (var method in _classMap.methods) {
                this[method] = this[method].bind(this);
            }
            // Call the constructor if any
            if (this.__init__) {
                this.__init__.apply(this, arguments);
            }
            return this;
        };

        // Inheritance
        __class__.prototype = inherit(this.$class);

        properties = properties || {};
        var property;
        var computedPropertyName;
        var annotations;
        var i;

        // Copy properties from mixins
        if (properties.__include__) {
            for (i = properties.__include__.length - 1 ; i >= 0 ; i--) {
                for (property in properties.__include__[i]) {
                    if (properties[property] === undefined) {
                        properties[property] = properties.__include__[i][property];
                    }
                }
            }
        }

        // Add properties
        for (property in properties || {}) {
            if (property == "__include__" || property == "__classvars__") {
                continue;
            }
            if (typeof properties[property] == "function") {
                computedPropertyName = undefined;
                _classMap.methods[property] = {annotations: {}};
                // Accessors / Mutators
                if (property.indexOf("get") === 0) {
                    computedPropertyName = property.slice(3, 4).toLowerCase() + property.slice(4, property.length);
                    if (!_classMap.computedProperties[computedPropertyName]) {
                        _classMap.computedProperties[computedPropertyName] = {annotations: {}};
                    }
                    _classMap.computedProperties[computedPropertyName].get = property;
                } else if (property.indexOf("set") === 0) {
                    computedPropertyName = property.slice(3, 4).toLowerCase() + property.slice(4, property.length);
                    if (!_classMap.computedProperties[computedPropertyName]) {
                        _classMap.computedProperties[computedPropertyName] = {annotations: {}};
                    }
                    _classMap.computedProperties[computedPropertyName].set = property;
                } else if (property.indexOf("has") === 0) {
                    computedPropertyName = property.slice(3, 4).toLowerCase() + property.slice(4, property.length);
                    if (!_classMap.computedProperties[computedPropertyName]) {
                        _classMap.computedProperties[computedPropertyName] = {annotations: {}};
                    }
                    _classMap.computedProperties[computedPropertyName].get = property;
                } else if (property.indexOf("is") === 0) {
                    computedPropertyName = property.slice(2, 3).toLowerCase() + property.slice(3, property.length);
                    if (!_classMap.computedProperties[computedPropertyName]) {
                        _classMap.computedProperties[computedPropertyName] = {annotations: {}};
                    }
                    _classMap.computedProperties[computedPropertyName].get = property;
                }
                // Annotations
                annotations = extractAnnotations(properties[property]);
                for (var annotation in annotations) {
                    _classMap.methods[property].annotations[annotation] = annotations[annotation];
                    if (computedPropertyName) {
                        _classMap.computedProperties[computedPropertyName]
                                 .annotations[annotation] = annotations[annotation];
                    }
                }
                // Wrapped method
                if (usesSpecialProperty(properties[property])) {
                    __class__.prototype[property] = (function (method, propertyName, computedPropertyName) {
                        return function () {
                            var _oldSuper = this.$super;
                            var _oldName = this.$name;
                            var _oldComputedPropertyName = this.$computedPropertyName;

                            this.$super = _superClass.prototype[propertyName];
                            this.$name = propertyName;
                            this.$computedPropertyName = computedPropertyName;

                            try {
                                return method.apply(this, arguments);
                            } finally {
                                if (_oldSuper) {
                                    this.$super = _oldSuper;
                                } else {
                                    delete this.$super;
                                }
                                if (_oldName) {
                                    this.$name = _oldName;
                                } else {
                                    delete this.$name;
                                }
                                if (_oldComputedPropertyName) {
                                    this.$computedPropertyName = _oldComputedPropertyName;
                                } else {
                                    delete this.$computedPropertyName;
                                }
                            }
                        };
                    })(properties[property], property, computedPropertyName);  // jshint ignore:line

                // Simple methods
                } else {
                    __class__.prototype[property] = properties[property];
                }
            } else {
                _classMap.attributes[property] = true;
                __class__.prototype[property] = properties[property];
            }
        }

        // Copy super class static properties
        var scStaticProps = Object.getOwnPropertyNames(_superClass);
        // Removes caller, callee and arguments from the list (strict mode)
        // Removes non enumerable Abitbol properties too
        scStaticProps = scStaticProps.filter(function (value) {
            return (["caller", "callee", "arguments", "$class", "$extend", "$map"].indexOf(value) == -1);
        });
        for (i = 0 ; i < scStaticProps.length ; i++) {
            if (__class__[scStaticProps[i]] === undefined) {
                __class__[scStaticProps[i]] = _superClass[scStaticProps[i]];
            }
        }

        // Add static properties
        if (properties.__classvars__) {
            for (property in properties.__classvars__) {
                __class__[property] = properties.__classvars__[property];
            }
        }

        // Add abitbol static properties
        Object.defineProperty(__class__, "$class", {
            enumerable: false,
            value: __class__
        });
        Object.defineProperty(__class__, "$extend", {
            enumerable: false,
            value: Class.$extend
        });
        Object.defineProperty(__class__, "$map", {
            enumerable: false,
            value: _classMap
        });

        return __class__;
    }
});

module.exports = Class;
