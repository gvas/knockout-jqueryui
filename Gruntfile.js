/*jslint node:true*/
module.exports = function (grunt) {

    'use strict';

    require('load-grunt-config')(grunt, {
        data: {
            buildId: process.env.TRAVIS_JOB_ID || (new Date()).valueOf().toString(),
            coreFiles: ['src/versions.js', 'src/init.js', 'src/bindingFactory.js'],
            widgets: ['src/accordion.js', 'src/autocomplete.js', 'src/button.js',
                'src/buttonset.js', 'src/datepicker.js', 'src/dialog.js', 'src/menu.js',
                'src/progressbar.js', 'src/slider.js', 'src/spinner.js', 'src/tabs.js',
                'src/tooltip.js']
        }
    });
};