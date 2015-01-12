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
                        return 'root.kojqui.utils';
                    }
                    return 'root.kojqui.' + changeCase.pascalCase(match[1]);
                }

                match = dependency.match(/^jquery-ui\/(.*)/);
                if (match) {
                    // 'jquery-ui/autocomplete' -> root.jQuery.ui.autocomplete
                    return 'root.jQuery.ui.' + match[1];
                }

                if (dependency === 'jquery') {
                    // 'jquery' -> root.jQuery
                    return 'root.jQuery';
                }

                if (dependency === 'knockout') {
                    // 'knockout' -> root.ko
                    return 'root.ko';
                }

                throw new Error('Unexpected dependency: ' + dependency);
            })
            .join(', ');

        return '(function (root, factory) {\r\n\r\n' +
            '    \'use strict\';\r\n\r\n' +
            '    root.kojqui.' + name + ' = factory(' + dependencies + ');\r\n' +
            '}(this,\r\n' +
            '    ' + match[2] + '));';
    }

    return {
        options: {
            nonull: true,
            separator: '\r\n',
            banner: '<%= meta.banner %>',
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
