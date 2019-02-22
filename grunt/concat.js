/*jslint node:true,regexp:true*/
module.exports = function (grunt, options) {

    'use strict';

    var path = require('path'),
        changeCase = require('change-case');

    function convert(src, filePath) {
        var name, match, dependencies;

        name = path.basename(filePath, '.js');
        if (name !== 'utils') {
            name = changeCase.pascalCase(name);
        }

        match = src.match(/define[\s\S]*?\[([\s\S]*?)\][\s\S]*?(function[\s\S]*)\);/);

        dependencies = match[1]
            .split(',')
            .map(function (dependency) {
                var match = dependency.match(/'(.*)'/);
                return match[1];
            })
            .map(function (dependency) {
                var match = dependency.match(/^\.\/(.+)/);
                if (match) {
                    // './BindingHandler' -> root.kojqui.BindingHandler
                    if (match[1] === 'utils') {
                        return 'kojqui.utils';
                    }
                    return 'kojqui.' + changeCase.pascalCase(match[1]);
                }

                match = dependency.match(/^jquery-ui\/(.*)/);
                if (match) {
                    // 'jquery-ui/autocomplete' -> root.jQuery.ui.autocomplete
                    return 'jQuery.ui.' + match[1];
                }

                if (dependency === 'jquery') {
                    // 'jquery' -> root.jQuery
                    return 'jQuery';
                }

                if (dependency === 'knockout') {
                    // 'knockout' -> root.ko
                    return 'ko';
                }

                throw new Error('Unexpected dependency: ' + dependency);
            })
            .join(', ');

        return '    (function (factory) {\r\n\r\n' +
            '        kojqui.' + name + ' = factory(' + dependencies + ');\r\n' +
            '    }(' + match[2] + '));';
    }

    return {
        options: {
            nonull: true,
            separator: '\r\n',
            banner: '<%= meta.banner %>',
            footer: '<%= meta.footer %>',
            process: convert
        },
        build: {
            src: [options.coreFiles, options.widgets],
            dest: 'build/<%= meta.name %>.js'
        },
        release: {
            src: [options.coreFiles, options.widgets],
            dest: 'dist/<%= meta.name %>.js'
        }
    };
};
