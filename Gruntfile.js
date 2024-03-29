module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        jshint: {
            all: ["src/*.js", "test/*.js"],
            options: {
                jshintrc: true
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
        },

        browserify: {
            dist: {
                files: {
                    "dist/<%= pkg.name %>.js": ["<%= pkg.main %>"]
                },
                options: {
                    browserifyOptions: {
                        "standalone": "Class"
                    }
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    "dist/<%= pkg.name %>.min.js": "dist/<%= pkg.name %>.js"
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default", ["browserify:dist", "uglify:dist"]);
    grunt.registerTask("lint", ["jshint", "jscs"]);
    grunt.registerTask("test", ["mochaTest"]);

};
