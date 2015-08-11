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
    var _superPrototype = this.prototype;

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

    __class__.$class = __class__;
    __class__.$extend = Class.$extend;

    return __class__;
};

module.exports =  Class;
