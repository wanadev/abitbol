"use strict";

var expect = require("expect.js");

var extractAnnotations = require("../src/annotation.js");

describe("annotation", function () {

    it("extracts annotations of a simple function", function () {
        // jshint ignore:start
        // jscs:disable
        function fn () {
            "@key1";
            "@key2 value";
            '@key3';
            '@key4 value';
            var foo = "bar";
        }
        // jscs:enable
        // jshint ignore:end

        var annotations = extractAnnotations(fn);  // jshint ignore:line

        expect(annotations).to.have.key("key1");
        expect(annotations).to.have.key("key2");
        expect(annotations).to.have.key("key3");
        expect(annotations).to.have.key("key4");

        expect(annotations.key1).to.be.ok();
        expect(annotations.key2).to.equal("value");
        expect(annotations.key3).to.be.ok();
        expect(annotations.key4).to.equal("value");
    });

    it("extracts annotations of a more complicated functions", function () {
        // jshint ignore:start
        // jscs:disable
        function fn (param1, param2) {
            "use strict";
            /**
             * comment
             */
            "@key1";  // comment
            /* comment */ "@key2 value";
            var foo = "bar";
        }
        // jscs:enable
        // jshint ignore:end

        var annotations = extractAnnotations(fn);  // jshint ignore:line

        expect(annotations).to.have.key("key1");
        expect(annotations).to.have.key("key2");

        expect(annotations.key1).to.be.ok();
        expect(annotations.key2).to.equal("value");
    });

    it("extracts annotations of a ES6-defined functions", function () {
        // jshint ignore:start
        // jscs:disable
        var obj = {
            fn(param1, param2) {
                "@key value";
            }
        }
        // jscs:enable
        // jshint ignore:end

        var annotations = extractAnnotations(obj.fn);  // jshint ignore:line

        expect(annotations).to.only.have.keys("key");

        expect(annotations.key).to.equal("value");
    });

    it("extracts annotations of a arrow functions", function () {
        // jshint ignore:start
        // jscs:disable
        var fn = param => {
            "@key value";
        }
        // jscs:enable
        // jshint ignore:end

        var annotations = extractAnnotations(fn);  // jshint ignore:line

        expect(annotations).to.only.have.keys("key");

        expect(annotations.key).to.equal("value");
    });

    /* Note: Node.js is not really happy with default parameters for now.
             So this test is currently disabled.

    it("extracts annotations with default parameters functions", function () {
        // jshint ignore:start
        // jscs:disable
        function fn (param1 = {}, param2 = function(param3) {}) {
            "@key value";
        }
        // jscs:enable
        // jshint ignore:end

        var annotations = extractAnnotations(fn);  // jshint ignore:line

        expect(annotations).to.only.have.keys("key");

        expect(annotations.key).to.equal("value");
    });
    */

    it("extracts annotations of a inline (minified?) functions", function () {
        // jshint ignore:start
        // jscs:disable
        function fn(param1,param2) {"@key1";"@key2 value";var a="@nope1 nope"}
        // jscs:enable
        // jshint ignore:end

        var annotations = extractAnnotations(fn);  // jshint ignore:line

        expect(annotations).to.have.key("key1");
        expect(annotations).to.have.key("key2");
        expect(annotations).not.to.have.key("nope1");

        expect(annotations.key1).to.be.ok();
        expect(annotations.key2).to.equal("value");
    });

    it("does not extract unwanted strings", function () {
        // jshint ignore:start
        // jscs:disable
        function fn () {
            "@key1";
            "@key2 value";
            var foo = "@nope1 nope";
            "@nope2 nope";
        }
        // jscs:enable
        // jshint ignore:end

        var annotations = extractAnnotations(fn);  // jshint ignore:line

        expect(annotations).to.have.key("key1");
        expect(annotations).to.have.key("key2");
        expect(annotations).not.to.have.key("nope1");
        expect(annotations).not.to.have.key("nope2");

        expect(annotations.key1).to.be.ok();
        expect(annotations.key2).to.equal("value");
    });

    it("does not extract commented annotation", function () {
        // jshint ignore:start
        // jscs:disable
        function fn () {
            "@key1";
            // "@nope1 nope";
            /* "@nope2 nope"; */
            "@key2 value";
        }
        // jscs:enable
        // jshint ignore:end

        var annotations = extractAnnotations(fn);  // jshint ignore:line

        expect(annotations).to.have.key("key1");
        expect(annotations).to.have.key("key2");
        expect(annotations).not.to.have.key("nope1");
        expect(annotations).not.to.have.key("nope2");

        expect(annotations.key1).to.be.ok();
        expect(annotations.key2).to.equal("value");
    });

    it("extracts annotations that contains escaped characters", function () {
        // jshint ignore:start
        // jscs:disable
        function fn (param1, param2) {
            "@key1 hello \"world\"";
            "@key2 hello\nworld";
            "@key3 hello\tworld";
            "@key4 hello\\world";
        }
        // jscs:enable
        // jshint ignore:end

        var annotations = extractAnnotations(fn);  // jshint ignore:line

        expect(annotations).to.have.key("key1");
        expect(annotations).to.have.key("key2");
        expect(annotations).to.have.key("key3");
        expect(annotations).to.have.key("key4");

        expect(annotations.key1).to.equal("hello \"world\"");
        expect(annotations.key2).to.equal("hello\nworld");
        expect(annotations.key3).to.equal("hello\tworld");
        expect(annotations.key4).to.equal("hello\\world");
    });

    it("trims useless spaces", function () {
        // jshint ignore:start
        // jscs:disable
        function fn () {
            " @key1    ";
            " @key2   value   ";
        }
        // jscs:enable
        // jshint ignore:end

        var annotations = extractAnnotations(fn);  // jshint ignore:line

        expect(annotations).to.have.key("key1");
        expect(annotations).to.have.key("key2");

        expect(annotations.key1).to.be.ok();
        expect(annotations.key2).to.equal("value");
    });

    it("casts automatically simple types", function () {
        // jshint ignore:start
        // jscs:disable
        function fn () {
            "@key1 true";
            "@key2 false";
            "@key3 null";
            "@key4 undefined";
            "@key5 42";
            "@key6 3.14";
        }
        // jscs:enable
        // jshint ignore:end

        var annotations = extractAnnotations(fn);  // jshint ignore:line

        expect(annotations.key1).to.be(true);
        expect(annotations.key2).to.be(false);
        expect(annotations.key3).to.be(null);
        expect(annotations.key4).to.be(undefined);
        expect(annotations.key5).to.be(42);
        expect(annotations.key6).to.be(3.14);
    });

});
