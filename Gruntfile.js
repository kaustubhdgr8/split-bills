module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    babel: {
      options: {
        sourceMap: true,
      },
      dist: {
        files: {
          "public/app.js": "src/scripts/app.js",
        },
      },
    },
    bake: {
      html: {
        files: {
          "src/templates/index.html": "src/templates/base.html",
        },
      },
    },
    concat: {
      js: {
        src: ["src/scripts/*.js", "!src/scripts/app.js"],
        dest: "src/scripts/app.js",
      },
    },
    copy: {
      html: {
        expand: true,
        flatten: true,
        src: ["src/templates/index.html", "src/templates/404.html"],
        dest: "public/",
      },
      css: {
        expand: true,
        flatten: true,
        src: ["src/styles/styles.css"],
        dest: "public/",
      },
      assets: {
        expand: true,
        flatten: false,
        src: ["assets/**/*"],
        dest: "public/",
      },
    },
    jshint: {
      all: ["Gruntfile.js", "src/**/*.js"],
      options: {
        esversion: 6,
      },
    },
    watch: {
      gruntfile: {
        files: "Gruntfile.js",
        tasks: ["jshint"],
      },
      src: {
        files: ["src/**/*", "!src/templates/index.html", "!src/scripts/app.js"],
        tasks: ["compile"],
      },
    },
  });

  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-bake");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default", ["compile", "watch"]);
  grunt.registerTask("compile", ["jshint", "concat", "babel", "bake", "copy"]);
};
