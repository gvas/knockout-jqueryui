/*global exports, $, ko*/
(function () {

    'use strict';

    var getMajorMinorVersion, versions, createObject;

    getMajorMinorVersion = function (version) {
        /// <summary>Returns the major.minor version from the version string.</summary>
        /// <param name='version' type='String'></param>
        /// <returns type='String'></returns>

        /*jslint regexp:true*/
        var match = (version || '').match(/^(\d)\.(\d+)/);
        /*jslint regexp:false*/

        if (!match) {
            return null;
        }

        return {
            major: parseInt(match[1], 10),
            minor: parseInt(match[2], 10)
        };
    };

    /// <summary>Version numbers for jQuery, jQuery UI and knockout libraries.</summary>
    versions = {
        jQuery: $ && $.fn ? getMajorMinorVersion($.fn.jquery) : null,
        jQueryUI: $ && $.ui ? getMajorMinorVersion($.ui.version) : null,
        knockout: ko ? getMajorMinorVersion(ko.version) : null
    };

    /// <summary>Simple shim for Object.create().</summary>
    createObject = Object.create || function (prototype) {
        function Type() { }
        Type.prototype = prototype;
        return new Type();
    };

    exports.utils = {
        versions: versions,
        createObject: createObject
    };
}());