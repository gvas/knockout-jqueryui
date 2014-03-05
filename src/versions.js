/*global versions:true, $, ko*/
versions = (function () {
    'use strict';

    var getMajorMinorVersion, jQuery, jQueryUI, knockout;

    getMajorMinorVersion = function (version) {
        /// <summary>Returns the major.minor version from the version string.</summary>
        /// <param name='version' type='String'></param>
        /// <returns type='String'></returns>

        /*jslint regexp:true*/
        var match = (version || '').match(/^(\d)\.(\d+)\..*$/);
        /*jslint regexp:false*/

        if (!match) {
            return null;
        }

        return {
            major: parseInt(match[1], 10),
            minor: parseInt(match[2], 10)
        };
    };

    jQuery = $ && $.fn ? getMajorMinorVersion($.fn.jquery) : null;
    jQueryUI = $ && $.ui ? getMajorMinorVersion($.ui.version) : null;
    knockout = ko ? getMajorMinorVersion(ko.version) : null;

    return {
        jQuery: jQuery,
        jQueryUI: jQueryUI,
        knockout: knockout
    };
}());