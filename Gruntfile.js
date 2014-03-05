/*global module, process*/
/*jslint maxlen:256*/
module.exports = function (grunt) {
    'use strict';

    var reBanners, reUseStrictDirectives, reNewLines, coreFiles, widgets, browsers, testUrls, prepareConcat, devDependencies, key;

    reBanners = /^(\s*\/\*[\s\S]*?\*\/\s*)*/;
    reUseStrictDirectives = /'use strict';/g;
    reNewLines = /\n/g;

    coreFiles = ['src/versions.js', 'src/init.js', 'src/bindingFactory.js'];
    widgets = ['src/accordion.js', 'src/autocomplete.js', 'src/button.js', 'src/buttonset.js',
        'src/datepicker.js', 'src/dialog.js', 'src/menu.js', 'src/progressbar.js', 'src/slider.js',
        'src/spinner.js', 'src/tabs.js', 'src/tooltip.js'];

    browsers = [{
        browserName: 'chrome',
        platform: 'Windows XP'
    }, {
        browserName: 'opera',
        platform: 'Windows XP'
    }, {
        browserName: 'firefox',
        platform: 'Windows XP'
    }, {
        browserName: 'internet explorer',
        platform: 'Windows XP',
        version: '7'
    }, {
        browserName: 'internet explorer',
        platform: 'Windows XP',
        version: '8'
    }, {
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '9'
    }, {
        browserName: 'internet explorer',
        platform: 'Windows 8',
        version: '10'
    }];

    // let's test each supported major and minor version of jQuery UI
    // let's test only the earliest supported and the latest versions of jQuery and knockout
    testUrls = [];
    ['1.8.3', '1.10.2'].forEach(function (jQueryVersion) {
        ['1.9.2', '1.10.4'].forEach(function (jQueryUIVersion) {
            ['2.2.0', '3.1.0'].forEach(function (knockoutVersion) {
                testUrls.push('http://127.0.0.1:9999/SpecRunner.html?' + ['jquery=' + jQueryVersion, 'jqueryui=' + jQueryUIVersion, 'knockout=' + knockoutVersion].join('&'));
            });
        });
    });
    // jQuery UI 1.8 is compatible only with jQuery <= 1.8
    ['2.2.0', '3.1.0'].forEach(function (knockoutVersion) {
        testUrls.push('http://127.0.0.1:9999/SpecRunner.html?' + ['jquery=1.8.3', 'jqueryui=1.8.24', 'knockout=' + knockoutVersion].join('&'));
    });

    prepareConcat = function (src) {
        return '\n    ' + src
        // strips all banners
            .replace(reBanners, '')
        // deletes the 'use strict' statements
            .replace(reUseStrictDirectives, '')
        // indents each line
            .replace(reNewLines, '\n    ');
    };

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            name: 'knockout-jqueryui',
            banner: '/*! <%= meta.name %> - v<%= pkg.version %> - <%= grunt.template.today("m/d/yyyy") %>\n' +
                '* <%= pkg.homepage %>\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                ' Licensed <%= pkg.license %> */\n'
        },
        concat: {
            build: {
                options: {
                    banner: '<%= meta.banner %>' + grunt.file.read('src/umdWrapperStart.js'),
                    footer: grunt.file.read('src/umdWrapperEnd.js'),
                    process: prepareConcat
                },
                src: [coreFiles, widgets],
                dest: 'build/<%= meta.name %>.js'
            }
        },
        uglify: {
            build: {
                src: '<%= concat.build.dest %>',
                dest: 'build/<%= meta.name %>.min.js'
            }
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
                maxlen: 256,
                globals: {
                    jQuery: false,
                    ko: false,
                    kojqui: false
                }
            },
            beforeconcat: ['Gruntfile.js', coreFiles, widgets],
            afterconcat: ['<%= concat.build.dest %>']
        },
        connect: {
            server: {
                options: {
                    base: '',
                    port: 9999
                }
            }
        },
        'saucelabs-jasmine': {
            all: {
                options: {
                    urls: testUrls,
                    tunnelTimeout: 5,
                    build: process.env.TRAVIS_JOB_ID,
                    concurrency: 3,
                    browsers: browsers,
                    testname: 'knockout-jqueryui',
                    tags: ['master'],
                    'record-video': false
                }
            }
        },
        watch: {}
    });

    // Loading dependencies
    devDependencies = grunt.file.readJSON('package.json').devDependencies;
    for (key in devDependencies) {
        if (devDependencies.hasOwnProperty(key) && key !== 'grunt' && key.indexOf('grunt') === 0) {
            grunt.loadNpmTasks(key);
        }
    }

    // the default task builds the library
    grunt.registerTask('default', ['jshint:beforeconcat', 'concat', 'jshint:afterconcat', 'uglify']);
    // the dev task spins up a web server on localhost:9999
    grunt.registerTask('dev', ['connect', 'watch']);
    // the test task builds the library and starts the jasmine tests on SauceLabs
    grunt.registerTask('test', ['default', 'connect', 'saucelabs-jasmine']);
};