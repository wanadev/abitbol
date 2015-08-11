var expect = require("expect.js");

var Class = require("../src/abitbol.js");

describe("Class", function () {

    it("can be extended", function () {
        var Cls1 = Class.$extend({
            prop1: "prop1"
        });

        var c1 = new Cls1();

        expect(c1).to.be.an(Cls1);
        expect(c1.prop1).to.equal("prop1");
    });

    it("instance keeps a reference to its class", function () {
        var Cls1 = Class.$extend();

        var c1 = new Cls1();

        expect(c1).to.be.an(Cls1.$class);
    });

    it("keeps a consistant inheritance", function () {
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

    it("can inherit properties from a parent class", function () {
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

    it("can override the properties of its parent class", function () {
        var Cls1 = Class.$extend({
            prop1: "prop1"
        });

        var Cls2 = Cls1.$extend({
            prop1: "override"
        });

        var c2 = new Cls2();

        expect(c2.prop1).to.equal("override");
    });

    it("calls it constructor only when instanciated", function () {
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

    it("can pass arguments to its constructor", function () {
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

    it("methods can access to their own class", function () {
        var Cls1 = Class.$extend({
            meth1: function () {
                return this.$class;
            }
        });

        var c1 = new Cls1();

        expect(c1.meth1()).to.be(Cls1.$class);
    });

    it("methods can access to their own name", function () {
        var Cls1 = Class.$extend({
            meth1: function () {
                return this.$name;
            }
        });

        var c1 = new Cls1();

        expect(c1.meth1()).to.equal("meth1");
    });

    it("methods can call their parent method", function () {
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
