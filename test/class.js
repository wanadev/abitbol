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

});
