/*jslint maxlen:256 node:true*/
module.exports = {
    name: 'knockout-jqueryui',
    banner: '/*! <%= meta.name %> - v<%= package.version %> - <%= grunt.template.today("m/d/yyyy") %>\r\n' +
        '* <%= package.homepage %>\r\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= package.author.name %> Licensed <%= package.license %> */\r\n' +
        '/*jslint browser:true*/\r\n' +
        '/*globals global, self, window, require, module, define*/\r\n\r\n' +
        '(function (factory, global) {\r\n' +
        '    \'use strict\';\r\n\r\n' +
        '    // Module systems magic dance.\r\n' +
        '    if (typeof require === \'function\' && typeof exports === \'object\' && typeof module === \'object\') {\r\n' +
        '        // CommonJS or Node: hard-coded dependency on \'knockout\'\r\n' +
        '        module.exports = factory(require(\'jquery\'), require(\'knockout\'), require(\'jquery-ui\'));\r\n' +
        '    } else if (typeof define === \'function\' && define.amd) {\r\n' +
        '        // AMD anonymous module with hard-coded dependency on \'knockout\'\r\n' +
        '        define([\'jquery\', \'knockout\', \'jquery-ui\', \'exports\'], factory);\r\n' +
        '    } else {\r\n' +
        '        // <script> tag: use the global `ko` object\r\n' +
        '        global.kojqui = factory(jQuery, ko, jQuery.ui);\r\n' +
        '    }\r\n' +
        '}(function (jQuery, ko) {\r\n' +
        '    \'use strict\';\r\n\r\n' +
        '    var kojqui = { version: \'<%= package.version %>\' };\r\n\r\n',
    footer: '\r\n\r\n    return kojqui;\r\n' +
        '}, typeof global !== \'undefined\' ? global : typeof self !== \'undefined\' ? self : typeof window !== \'undefined\' ? window : {}));'
};
