'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        '*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-summary')
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-nice-package');

  grunt.registerTask('default', ['jshint', 'nice-package']);
};
