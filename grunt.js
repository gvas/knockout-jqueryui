/*global module*/
/*jslint maxlen:256*/
module.exports = function (grunt) {
    'use strict';

    var reBanners, reUseStrictDirectives, reNewLines, coreFiles, widgets, prepareConcat;

    reBanners = /^(\s*\/\*[\s\S]*?\*\/\s*)*/;
    reUseStrictDirectives = /'use strict';/g;
    reNewLines = /\n/g;

    coreFiles = ['src/versions.js', 'src/init.js', 'src/bindingFactory.js'];
    widgets = ['src/accordion.js', 'src/autocomplete.js', 'src/button.js', 'src/buttonset.js',
        'src/datepicker.js', 'src/dialog.js', 'src/menu.js', 'src/progressbar.js', 'src/slider.js',
        'src/spinner.js', 'src/tabs.js', 'src/tooltip.js'];

    prepareConcat = function (files) {
        return files.map(function (file) {
            return '<prepare_concat:' + file + '>';
        });
    };

    grunt.registerHelper('prepare_concat', function (filepath) {
        return '\n    ' + grunt.file.read(filepath)
            // strips all banners
            .replace(reBanners, '')
            // deletes the 'use strict' statements
            .replace(reUseStrictDirectives, '')
            // indents each line
            .replace(reNewLines, '\n    ');
    });

    // Project configuration.
    grunt.initConfig({
        pkg: '<json:package.json>',
        meta: {
            name: 'knockout-jqueryui',
            banner: '/*! <%= meta.name %> - v<%= pkg.version %> - <%= grunt.template.today("m/d/yyyy") %>\n' +
                '* <%= pkg.homepage %>\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                ' Licensed <%= pkg.license %> */\n'
        },
        concat: {
            build: {
                src: ['<banner>', 'src/umdWrapperStart.js', prepareConcat(coreFiles), prepareConcat(widgets), 'src/umdWrapperEnd.js'],
                dest: 'build/<%= meta.name %>.js'
            }
        },
        min: {
            build: {
                src: '<%= concat.build.dest %>',
                dest: 'build/<%= meta.name %>.min.js'
            }
        },
        lint: {
            beforeconcat: ['grunt.js', coreFiles, widgets],
            afterconcat: ['<%= concat.build.dest %>']
        },
        jshint: {
            options: {
                bitwise: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                forin: true,
                immed: true,
                indent: 4,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                nonew: true,
                plusplus: true,
                quotmark: 'single',
                regexp: true,
                undef: true,
                unused: true,
                strict: true,
                trailing: true,
                maxlen: 256
            },
            globals: {
                jQuery: false,
                ko: false,
                kojqui: false
            }
        }
    });

    // Default task.
    grunt.registerTask('default', 'lint:beforeconcat concat lint:afterconcat min');
};