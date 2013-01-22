/*jslint browser:true*/
(function () {
    'use strict';

    var exportObject, getMajorMinorVersion;

    exportObject = function (ns, name, obj) {
        /// <summary>Makes an object available under a namespace.</summary>
        /// <param name='ns' type='String'></param>
        /// <param name='name' type='String'></param>
        /// <param name='obj' type='Object'></param>

        var current, parts, i, il;

        current = window;
        parts = ns.split('.');
        for (i = 0, il = parts.length; i < il; i += 1) {
            current = current[parts[i]] = current[parts[i]] || {};
        }

        current[name] = obj;
    };

    getMajorMinorVersion = function (version) {
        /// <summary>Returns the major.minor version from the version string.</summary>
        /// <param name='version' type='String'></param>
        /// <returns type='String'></returns>

        var match = (version || '').match(/^(\d\.\d+)\.\d+$/);

        return match ? match[1] : null;
    };

    window.kojqui = window.kojqui || {};

    exportObject('kojqui', 'utils', {
        exportObject: exportObject,
        getMajorMinorVersion: getMajorMinorVersion
    });
}());