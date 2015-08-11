var _disableConstructor = false;

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

    var __class__ = function () {
        if (_disableConstructor) {
            return;
        }
        if (this.__init__) {
            this.__init__.apply(this, arguments);
        }
        return this;
    };

    __class__.prototype = inherit(this.$class);

    for (var property in properties || {}) {
        if (typeof properties[property] == "function") {
            __class__.prototype[property] = (function (propertyName, method) {
                return function () {
                    this.$class = __class__;
                    this.$super = _superClass.prototype[propertyName];
                    this.$name = propertyName;
                    return method.apply(this, arguments);
                };
            })(property, properties[property]);  // jshint ignore:line
        } else {
            __class__.prototype[property] = properties[property];
        }
    }

    __class__.$class = __class__;
    __class__.$extend = Class.$extend;

    return __class__;
};

module.exports = Class;
