var _disableConstructor = false;

// Inherit from a class without calling its constructor.
function inherit(superClass) {
    _disableConstructor = true;
    var __class__ = new superClass();
    _disableConstructor = false;
    return __class__;
}

var Class = function () {};
Class.$class = Class;

Class.$extend = function (properties) {
    var _superClass = this;

    // New class
    var __class__ = function () {
        if (_disableConstructor) {
            return;
        }
        if (this.__init__) {
            this.__init__.apply(this, arguments);
        }
        this.$class = __class__;
        return this;
    };

    // Inheritance
    __class__.prototype = inherit(this.$class);

    properties = properties || {};
    var property;
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
        if (property == "__include__") {
            continue;
        }
        if (typeof properties[property] == "function") {
            __class__.prototype[property] = (function (propertyName, method) {
                return function () {
                    this.$super = _superClass.prototype[propertyName];
                    this.$name = propertyName;
                    try {
                        return method.apply(this, arguments);
                    } finally {
                        delete this.$super;
                        delete this.$name;
                    }
                };
            })(property, properties[property]);  // jshint ignore:line
        } else {
            __class__.prototype[property] = properties[property];
        }
    }

    // Copy super class static properties
    // TODO

    // Add static properties
    // TODO

    // Add abitbol static properties
    __class__.$class = __class__;
    __class__.$extend = Class.$extend;

    return __class__;
};

module.exports = Class;
