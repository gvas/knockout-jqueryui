/*jslint node:true unparam:true*/
module.exports = function (grunt, options) {

    'use strict';

    return {
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
        build: ['Gruntfile.js', 'build/<%= meta.name %>.js', 'src/*.js'],
        release: ['dist/<%= meta.name %>.js', 'dist/amd/*.js']
    };
};
