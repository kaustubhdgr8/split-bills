module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    "babel": {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          "public/app.js": "src/**.js"
        }
      }
    },
    "copy": {
      files: {
        expand: true,
        flatten: true,
        cwd: "src",
        src: ["**/*", "!*.js"],
        dest: "public/"
      }
    },
    "jshint": {
      all: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        'esversion': 6
      }
    },
    "watch": {
      gruntfile: {
        files: "Gruntfile.js",
        tasks: ["jshint"]
      },
      src: {
        files: ["src/**/*"],
        tasks: ["compile"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask("default", ["compile", "watch"]);
  grunt.registerTask("compile", ["jshint", "babel", "copy"]);
};