'use strict';

module.exports = function (grunt) {

    'use strict';

    grunt.registerTask('release', 'Creates a new release.', function (version) {

        if (version == null) {
            grunt.warn('Version number must be specified, like grunt release:2.3.1');
        }

        /*
        - bumps version in package.json
        - executes the default task (linting, concatenating, etc.)
        - creates the files to publish in the dist folder
        - commits, tags and pushes the new release to upstream
        */
        grunt.option('setversion', version);
        grunt.task.run('bump-only', 'test', 'concat:release', 'jshint:release', 'copy', 'uglify', 'compress', 'bump-commit');
    });
};
