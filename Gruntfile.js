/*jslint node:true*/
module.exports = function (grunt) {

    'use strict';

    require('load-grunt-config')(grunt, {
        data: {
            tunnelId: Math.floor((new Date()).getTime() / 1000 - 1230768000).toString(),
            coreFiles: ['src/versions.js', 'src/init.js', 'src/bindingFactory.js'],
            widgets: ['src/accordion.js', 'src/autocomplete.js', 'src/button.js',
                'src/buttonset.js', 'src/datepicker.js', 'src/dialog.js', 'src/menu.js',
                'src/progressbar.js', 'src/slider.js', 'src/spinner.js', 'src/tabs.js',
                'src/tooltip.js']
        }
    });
};