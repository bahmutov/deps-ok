'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-nice-package');

  grunt.registerTask('default', ['jshint', 'nice-package']);
};
