/*jslint node:true*/
module.exports = function (grunt, options) {

    'use strict';

    var prepareConcat, indent;

    prepareConcat = function (src) {
        return src
        // deletes the 'use strict' statements
            .replace(/^\s*'use strict';\s*$/mg, '');
    };

    indent = function (src) {
        return '    ' + src
            .replace(/(\r?\n)/g, '$1    ');
    };

    return {
        options: {
            nonull: true
        },
        concat: {
            options: {
                stripBanners: true,
                separator: '\r\n\r\n',
                process: prepareConcat
            },
            src: [options.coreFiles, options.widgets],
            dest: 'build/<%= meta.name %>.js'
        },
        indent: {
            options: {
                process: indent
            },
            src: '<%= concat.concat.dest %>',
            dest: '<%= concat.concat.dest %>'
        },
        wrap: {
            options: {
                banner: '<%= meta.banner %>',
                process: true
            },
            src: 'src/wrapper.template',
            dest: '<%= concat.concat.dest %>'
        }
    };
};