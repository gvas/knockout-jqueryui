/*jslint maxlen:256 node:true*/

'use strict';

module.exports = function (grunt) {
    // the default task builds the library
    grunt.registerTask('default', ['concat:build', 'jshint:build']);
    // the dev task spins up a web server on localhost:9999
    grunt.registerTask('dev', ['connect', 'watch']);
    // the test task builds the library and starts the jasmine tests on SauceLabs
    grunt.registerTask('test', ['default', 'connect', 'sauce_tunnel', 'saucelabs-jasmine', 'sauce_tunnel_stop']);
};
