/*jslint maxlen:256 node:true*/
module.exports = function (grunt) {

    'use strict';

    // the default task builds the library
    grunt.registerTask('default', ['jshint:beforeconcat', 'concat', 'jshint:afterconcat', 'uglify']);
    // the dev task spins up a web server on localhost:9999
    grunt.registerTask('dev', ['connect', 'watch']);
    // the test task builds the library and starts the jasmine tests on SauceLabs
    grunt.registerTask('test', ['default', 'connect', 'force:on', 'saucelabs-jasmine', 'force:restore', 'tag-jobs']);
};