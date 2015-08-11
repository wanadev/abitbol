module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        jshint: {
            all: ["src/*.js", "test/*.js"],
            options: {
                futurehostile: true,
                freeze: true,
                latedef: true,
                noarg: true,
                nocomma: true,
                nonbsp: true,
                nonew: true,
                undef: true,
                node: true,
                curly: true,
                mocha: true
            }
        },

        jscs: {
            all: ["src/*.js", "test/*.js"],
            options: {
                config: ".jscsrc"
            }
        },

        mochaTest: {
            test: {
                src: ["test/**/*.js"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks("grunt-mocha-test");

    grunt.registerTask("default", ["test"]);
    grunt.registerTask("test", ["jshint", "jscs", "mochaTest"]);

};
