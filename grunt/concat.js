/*jslint node:true*/
module.exports = function (grunt, options) {

    'use strict';

    var reBanners, reUseStrictDirectives, reNewLines, prepareConcat;

    reBanners = /^(\s*\/\*[\s\S]*?\*\/\s*)*/;
    reUseStrictDirectives = /'use strict';/g;
    reNewLines = /\n/g;

    prepareConcat = function (src) {
        return '\n    ' + src
        // strips all banners
            .replace(reBanners, '')
        // deletes the 'use strict' statements
            .replace(reUseStrictDirectives, '')
        // indents each line
            .replace(reNewLines, '\n    ');
    };

    return {
        build: {
            options: {
                banner: '<%= meta.banner %>' + grunt.file.read('src/umdWrapperStart.js'),
                footer: grunt.file.read('src/umdWrapperEnd.js'),
                process: prepareConcat
            },
            src: [options.coreFiles, options.widgets],
            dest: 'build/<%= meta.name %>.js'
        }
    };
};