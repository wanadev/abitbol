"use strict";

var expect = require("expect.js");

var Class = require("../src/abitbol.js");

describe("Class hooks", function () {

    it("are called for pre and post build", function () {
        var $pre = false;
        var $post = false;

        var Cls = Class.$extend({
            __preBuild__: function () {
                $pre = true;
            },

            __postBuild__: function () {
                $post = true;
            }
        });

        expect($pre).to.ok();
        expect($post).to.ok();
    });

    it("are called for pre and post build with inheritance", function () {
        var $pre = 0;
        var $post = 0;

        var Cls0 = Class.$extend({
            __preBuild__: function () {
                $pre++;
            },

            __postBuild__: function () {
                $post++;
            }
        });
        var Cls1 = Cls0.$extend();
        var Cls2 = Cls1.$extend();
        var Cls3 = Cls2.$extend({
            __postBuild__: function () {
                // Not incrementing
            }
        });

        expect($pre).to.equal(4);
        expect($post).to.equal(3);
    });

    it("passes correct arguments", function () {
        var clsProperties = {
            __preBuild__: function (properties, NewClass, SuperClass) {
                expect(properties).to.equal(clsProperties);
                expect(NewClass.prototype).to.be.a(Class);
                expect(SuperClass).to.equal(Class);
            },

            __postBuild__: function (properties, NewClass, SuperClass) {
                expect(properties).to.equal(clsProperties);
                expect(NewClass.prototype).to.be.a(Class);
                expect(SuperClass).to.equal(Class);
            }
        };

        Class.$extend(clsProperties);
    });

    it("can alter the properties by adding getters", function () {
        var Cls = Class.$extend({
            __preBuild__: function (properties) {
                Object.assign(properties, {
                    getProp: function () {
                        return true;
                    },

                    isGoodProp: function () {
                        return true;
                    },

                    hasNiceProp: function () {
                        return true;
                    },
                });
            },
        });

        var cls = new Cls();
        expect(cls.prop).to.be.ok();
        expect(cls.goodProp).to.be.ok();
        expect(cls.niceProp).to.be.ok();
    });

    it("can alter the properties by adding setters", function () {
        var Cls = Class.$extend({
            __preBuild__: function (properties) {
                Object.assign(properties, {
                    _prop: false,
                    getProp: function () {
                        return this._prop;
                    },
                    setProp: function (prop) {
                        this._prop = prop;
                    },
                });
            },
        });

        var cls = new Cls();
        expect(cls.prop).not.to.be.ok();
        cls.prop = true;
        expect(cls.prop).to.be.ok();
        cls.setProp(false);
        expect(cls.prop).not.to.be.ok();
    });

    it("can alter the properties by adding classvars", function () {
        var Cls = Class.$extend({
            __preBuild__: function (properties) {
                Object.assign(properties, {
                    __classvars__: {
                        StaticProp: true
                    }
                });
            },
        });

        expect(Cls.StaticProp).to.be.ok();
    });

    // @todo Test inherance

});
