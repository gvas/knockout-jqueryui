/*global kojqui*/
/*jslint browser:true*/
(function () {
    'use strict';

    var uiVersion, koVersion;

    // dependency checks
    if (!window.jQuery) {
        throw new Error('jQuery must be loaded before knockout-jquery.');
    }
    if (!window.jQuery.ui) {
        throw new Error('jQuery UI must be loaded before knockout-jquery.');
    }
    if (!window.ko) {
        throw new Error('knockout must be loaded before knockout-jquery.');
    }

    uiVersion = kojqui.utils.getMajorMinorVersion(window.jQuery.ui.version);
    if (uiVersion !== '1.9' && uiVersion !== '1.10') {
        throw new Error('This version of the jQuery UI library is not supported.');
    }

    koVersion = kojqui.utils.getMajorMinorVersion(window.ko.version);
    if (koVersion !== '2.2') {
        throw new Error('This version of the knockout library is not supported.');
    }

    kojqui.utils.exportObject('kojqui', 'version', '0.2.0');
}());