(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Class = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _disableConstructor = false;

// Inherit from a class without calling its constructor.
function inherit(SuperClass) {
    _disableConstructor = true;
    var __class__ = new SuperClass();
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
        if (property == "__include__" || property == "__classvars__") {
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
    var scStaticProps = Object.getOwnPropertyNames(_superClass);
    // Removes caller, callee and arguments from the list (strict mode)
    scStaticProps = scStaticProps.filter(function (value) {
        return (["caller", "callee", "arguments"].indexOf(value) == -1);
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
    __class__.$class = __class__;
    __class__.$extend = Class.$extend;

    return __class__;
};

module.exports = Class;

},{}]},{},[1])(1)
});