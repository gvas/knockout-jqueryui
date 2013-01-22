/*global module*/
/*jslint maxlen:256*/
module.exports = function (grunt) {
    'use strict';

    var coreFiles, widgets, stripBanner;

    coreFiles = ['src/utils.js', 'src/init.js', 'src/bindingFactory.js'];
    widgets = ['src/accordion.js', 'src/autocomplete.js', 'src/button.js', 'src/buttonset.js',
        'src/datepicker.js', 'src/dialog.js', 'src/menu.js', 'src/progressbar.js', 'src/slider.js',
        'src/spinner.js', 'src/tabs.js', 'src/tooltip.js'];

    stripBanner = function (files) {
        return files.map(function (file) {
            return '<strip_all_banners:' + file + '>';
        });
    };

    grunt.registerHelper('strip_all_banners', function (filepath) {
        return grunt.file.read(filepath).replace(/^(\s*\/\*[\s\S]*?\*\/\s*)*/, '');
    });

    // Project configuration.
    grunt.initConfig({
        pkg: '<json:package.json>',
        meta: {
            name: 'knockout-jqueryui',
            banner: '/*! <%= meta.name %> - v<%= pkg.version %> - <%= grunt.template.today("m/d/yyyy") %>\n' +
                '* <%= pkg.homepage %>\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                ' Licensed <%= pkg.license %> */\n' +
                '/*global ko,$*/\n' +
                '/*jslint browser:true maxlen:256*/'
        },
        concat: {
            build: {
                src: ['<banner>', stripBanner(coreFiles), stripBanner(widgets)],
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
            beforeconcat: ['grunt.js', 'src/**/*.js'],
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