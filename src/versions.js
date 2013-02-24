/*global versions:true, $, ko*/
versions = (function () {
    'use strict';

    var getMajorMinorVersion, jQuery, jQueryUI, knockout;

    getMajorMinorVersion = function (version) {
        /// <summary>Returns the major.minor version from the version string.</summary>
        /// <param name='version' type='String'></param>
        /// <returns type='String'></returns>

        var match = (version || '').match(/^(\d\.\d+)\.\d+$/);

        return match ? match[1] : null;
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