var expect = require("expect.js");

var Class = require("../src/abitbol.js");

describe("Class", function () {

    describe("instances", function () {

        it("keeps a reference to their class", function () {
            var Cls1 = Class.$extend({
                meth1: function () {
                    $c = this.$class;
                }
            });

            var $c;
            var c1 = new Cls1();
            c1.meth1();

            expect($c).to.be(Cls1);
            expect(Cls1.$class).to.be(Cls1);
            expect(c1).to.be.an(Cls1.$class);
        });

        it("stay clean (no trash properties)", function () {
            var Cls1 = Class.$extend({

                __include__: [],
                __classvars__: {},

                meth1: function () {
                    // Here we can access to this.$super() and this.$name
                }
            });

            var c1 = new Cls1();
            c1.meth1();

            expect(Object.getOwnPropertyNames(c1)).not.to.contain("$super");
            expect(Object.getOwnPropertyNames(c1)).not.to.contain("$name");

            expect(Cls1.prototype.__include__).to.be(undefined);
            expect(Cls1.prototype.__classvars__).to.be(undefined);
            expect(c1.__include__).to.be(undefined);
            expect(c1.__classvars__).to.be(undefined);
        });

        it("special properties are not enumerable", function () {
            var Cls1 = Class.$extend();

            var c1 = new Cls1();

            var p;
            for (p in Cls1) {
                expect(p).not.to.equal("$class");
                expect(p).not.to.equal("$extend");
                expect(p).not.to.equal("$map");
                expect(p).not.to.equal("$data");
            }

            for (p in c1) {
                expect(p).not.to.equal("$class");
                expect(p).not.to.equal("$extend");
                expect(p).not.to.equal("$map");
                expect(p).not.to.equal("$data");
            }
        });

        it("provides a $data object to store private values", function () {
            var Cls1 = Class.$extend();

            var c1 = new Cls1();

            expect(c1.$data).to.be.an(Object);
        });

    });

    describe("inheritance", function () {

        it("allows any class to be extended", function () {
            var Cls1 = Class.$extend({
                prop1: "prop1"
            });

            var c1 = new Cls1();

            expect(c1).to.be.an(Cls1);
            expect(c1.prop1).to.equal("prop1");
        });

        it("is consistent and allows the instanceof operator to work properly", function () {
            var Cls1 = Class.$extend();
            var Cls2 = Cls1.$extend();

            var c1 = new Cls1();
            var c2 = new Cls2();

            expect(c1).to.be.an(Class);
            expect(c1).to.be.an(Cls1);
            expect(c1).not.to.be.an(Cls2);

            expect(c2).to.be.an(Class);
            expect(c2).to.be.an(Cls1);
            expect(c2).to.be.an(Cls2);
        });

        it("allows to inherit super class' properties", function () {
            var Cls1 = Class.$extend({
                prop1: "prop1"
            });

            var Cls2 = Cls1.$extend({
                prop2: "prop2"
            });

            var c2 = new Cls2();

            expect(c2.prop1).to.equal("prop1");
            expect(c2.prop2).to.equal("prop2");
        });

        it("allows super class' properties to be overridden", function () {
            var Cls1 = Class.$extend({
                prop1: "prop1"
            });

            var Cls2 = Cls1.$extend({
                prop1: "override"
            });

            var c2 = new Cls2();

            expect(c2.prop1).to.equal("override");
        });

    });

    describe("constructor", function () {

        it("is called only when the class is instantiated", function () {
            var Cls1 = Class.$extend({
                __init__: function () {
                    this.ok = true;
                }
            });

            var Cls2 = Cls1.$extend();

            var Cls3 = Cls1.$extend({
                __init__: function () {
                }
            });

            var c1 = new Cls1();
            var c2 = new Cls2();
            var c3 = new Cls3();

            expect(c1.ok).to.be.ok();
            expect(c2.ok).to.be.ok();
            expect(c3.ok).not.to.be.ok();
        });

        it("can gets argument passed to the real constructor when instantiating the class", function () {
            var Cls1 = Class.$extend({
                __init__: function (param1, param2) {
                    this.param1 = param1;
                    this.param2 = param2;
                }
            });

            var c1 = new Cls1("a", "b");

            expect(c1.param1).to.equal("a");
            expect(c1.param2).to.equal("b");
        });

    });

    describe("methods", function () {

        it("can access to a reference to their classes", function () {
            var Cls1 = Class.$extend({
                meth1: function () {
                    return this.$class;
                }
            });

            var c1 = new Cls1();

            expect(c1.meth1()).to.be(Cls1.$class);
        });

        it("can access to their own name", function () {
            var Cls1 = Class.$extend({
                meth1: function () {
                    return this.$name;
                }
            });

            var c1 = new Cls1();

            expect(c1.meth1()).to.equal("meth1");
        });

        it("can call their super method", function () {
            var Cls1 = Class.$extend({
                meth1: function (param1, param2) {
                    this.param1 = param1;
                    this.param2 = param2;
                }
            });

            var Cls2 = Cls1.$extend({
                meth1: function (param1, param2) {
                    this.$super(param2, param1);
                }
            });

            var Cls3 = Cls1.$extend({
                meth1: function () {}
            });

            var c1 = new Cls1();
            var c2 = new Cls2();
            var c3 = new Cls3();

            c1.meth1("a", "b");
            c2.meth1("a", "b");
            c3.meth1("a", "b");

            expect(c1.param1).to.equal("a");
            expect(c1.param2).to.equal("b");

            expect(c2.param1).to.equal("b");
            expect(c2.param2).to.equal("a");

            expect(c3.param1).to.be(undefined);
            expect(c3.param2).to.be(undefined);
        });

    });

    describe("mixins", function () {

        it("can include properties", function () {
            var Cls1 = Class.$extend({
                __include__: [
                    {
                        meth1: function () {},
                        attr1: "foo"
                    }
                ]
            });

            expect(Cls1.prototype.meth1).not.to.be(undefined);
            expect(Cls1.prototype.attr1).to.equal("foo");
        });

        it("included properties cannot override given properties", function () {
            var Cls1 = Class.$extend({
                __include__: [
                    {
                        attr1: "inc"
                    }
                ],

                attr1: "prop"
            });

            expect(Cls1.prototype.attr1).to.equal("prop");
        });

        it("copies only the latest included property if there is conflicts", function () {
            var Cls1 = Class.$extend({
                __include__: [
                    {
                        attr1: "inc1"
                    },
                    {
                        attr1: "inc2"
                    }
                ]
            });

            expect(Cls1.prototype.attr1).to.equal("inc2");
        });

    });

    describe("static properties", function () {

        it("can be added to the class", function () {
            var Cls1 = Class.$extend({
                __classvars__: {
                    static1: "static1"
                }
            });

            var c1 = new Cls1();

            expect(Cls1.static1).to.equal("static1");
            expect(Cls1.prototype.static1).to.be(undefined);
            expect(c1.static1).to.be(undefined);
        });

        it("can be inherited", function () {
            var Cls1 = Class.$extend({
                __classvars__: {
                    static1: "static1"
                }
            });

            var Cls2 = Cls1.$extend();

            var c2 = new Cls2();

            expect(Cls2.static1).to.equal("static1");
            expect(Cls2.prototype.static1).to.be(undefined);
            expect(c2.static1).to.be(undefined);
        });

        it("can be overridden", function () {
            var Cls1 = Class.$extend({
                __classvars__: {
                    static1: "static1"
                }
            });

            var Cls2 = Cls1.$extend({
                __classvars__: {
                    static1: "static2"
                }
            });

            var c2 = new Cls2();

            expect(Cls2.static1).to.equal("static2");
        });

    });

    describe("map", function () {

        it("is defined with right sections", function () {
            var Cls1 = Class.$extend();

            expect(Cls1.$map).not.to.be(undefined);
            expect(Cls1.$map.attributes).not.to.be(undefined);
            expect(Cls1.$map.methods).not.to.be(undefined);

            var c1 = new Cls1();

            expect(c1.$map).not.to.be(undefined);
            expect(c1.$map.attributes).not.to.be(undefined);
            expect(c1.$map.methods).not.to.be(undefined);
        });

        it("contains attributes", function () {
            var Cls1 = Class.$extend({
                attr1: "a"
            });

            expect(Cls1.$map.attributes.length).to.equal(1);
            expect(Cls1.$map.attributes).to.contain("attr1");
            expect(Cls1.$map.methods.length).to.equal(0);

            var c1 = new Cls1();

            expect(c1.$map.attributes.length).to.equal(1);
            expect(c1.$map.attributes).to.contain("attr1");
            expect(c1.$map.methods.length).to.equal(0);
        });

        it("contains methods", function () {
            var Cls1 = Class.$extend({
                meth1: function () {}
            });

            expect(Cls1.$map.methods.length).to.equal(1);
            expect(Cls1.$map.methods).to.contain("meth1");
            expect(Cls1.$map.attributes.length).to.equal(0);

            var c1 = new Cls1();

            expect(c1.$map.methods.length).to.equal(1);
            expect(c1.$map.methods).to.contain("meth1");
            expect(c1.$map.attributes.length).to.equal(0);
        });

        it("contains inherited attributes", function () {
            var Cls1 = Class.$extend({
                attr1: "a"
            });

            var Cls2 = Cls1.$extend({
                attr2: "b"
            });

            expect(Cls2.$map.attributes.length).to.equal(2);
            expect(Cls2.$map.attributes).to.contain("attr1");
            expect(Cls2.$map.attributes).to.contain("attr2");
            expect(Cls2.$map.methods.length).to.equal(0);

            var c2 = new Cls2();

            expect(c2.$map.attributes.length).to.equal(2);
            expect(c2.$map.attributes).to.contain("attr1");
            expect(c2.$map.attributes).to.contain("attr2");
            expect(c2.$map.methods.length).to.equal(0);
        });

        it("contains inherited methods", function () {
            var Cls1 = Class.$extend({
                meth1: function () {}
            });

            var Cls2 = Cls1.$extend({
                meth2: function () {}
            });

            expect(Cls2.$map.methods.length).to.equal(2);
            expect(Cls2.$map.methods).to.contain("meth1");
            expect(Cls2.$map.methods).to.contain("meth2");
            expect(Cls2.$map.attributes.length).to.equal(0);

            var c2 = new Cls2();

            expect(c2.$map.methods.length).to.equal(2);
            expect(c2.$map.methods).to.contain("meth1");
            expect(c2.$map.methods).to.contain("meth2");
            expect(c2.$map.attributes.length).to.equal(0);
        });

        it("contains computed properties with informations about accessors and mutators", function () {
            var Cls1 = Class.$extend({
                // prop1 (rw)
                getProp1: function () {},
                setProp1: function () {},

                // prop2 (ro)
                getProp2: function () {},

                // prop3 (wo)
                setProp3: function () {},

                // prop4 (ro, is)
                isProp4: function () {},

                // prop5 (ro, has)
                hasProp5: function () {}
            });

            expect(Cls1.$map.computedProperties).not.to.be(undefined);

            expect(Cls1.$map.computedProperties.prop1).not.to.be(undefined);
            expect(Cls1.$map.computedProperties.prop1.get).to.equal("getProp1");
            expect(Cls1.$map.computedProperties.prop1.set).to.equal("setProp1");

            expect(Cls1.$map.computedProperties.prop2).not.to.be(undefined);
            expect(Cls1.$map.computedProperties.prop2.get).to.equal("getProp2");
            expect(Cls1.$map.computedProperties.prop2.set).to.be(undefined);

            expect(Cls1.$map.computedProperties.prop3).not.to.be(undefined);
            expect(Cls1.$map.computedProperties.prop3.get).to.be(undefined);
            expect(Cls1.$map.computedProperties.prop3.set).to.equal("setProp3");

            expect(Cls1.$map.computedProperties.prop4).not.to.be(undefined);
            expect(Cls1.$map.computedProperties.prop4.get).to.equal("isProp4");
            expect(Cls1.$map.computedProperties.prop4.set).to.be(undefined);

            expect(Cls1.$map.computedProperties.prop5).not.to.be(undefined);
            expect(Cls1.$map.computedProperties.prop5.get).to.equal("hasProp5");
            expect(Cls1.$map.computedProperties.prop5.set).to.be(undefined);
        });

    });

    describe("accessors and mutators", function () {

        it("generates computed properties", function () {
            var Cls1 = Class.$extend({
                getProp1: function () {
                    return "prop1";
                }
            });

            var c1 = new Cls1();

            expect(c1.prop1).not.to.be(undefined);
            expect(c1.prop1).to.equal("prop1");
        });

        it("are used to manipulate computed properties", function () {
            var Cls1 = Class.$extend({
                __init__: function () {
                    this.prop1 = "a";
                },

                getProp1: function () {
                    return "get" + this.$data.prop1;
                },

                setProp1: function (value) {
                    this.$data.prop1 = "set" + value;
                }
            });

            var c1 = new Cls1();

            expect(c1.prop1).not.to.be(undefined);

            expect(c1.$data.prop1).to.equal("seta");
            expect(c1.prop1).to.equal("getseta");

            c1.prop1 = "b";

            expect(c1.$data.prop1).to.equal("setb");
            expect(c1.prop1).to.equal("getsetb");
        });
    });

});
