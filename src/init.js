/*global versions*/
/*jslint maxlen:256*/
(function () {
    'use strict';

    // dependency checks
    if (!versions.jQuery) {
        throw new Error('jQuery must be loaded before knockout-jquery.');
    }
    if (!versions.jQueryUI) {
        throw new Error('jQuery UI must be loaded before knockout-jquery.');
    }
    if (!versions.knockout) {
        throw new Error('knockout must be loaded before knockout-jquery.');
    }

    if (versions.jQueryUI !== '1.8' && versions.jQueryUI !== '1.9' && versions.jQueryUI !== '1.10') {
        throw new Error('This version of the jQuery UI library is not supported.');
    }

    if (versions.knockout !== '2.2') {
        throw new Error('This version of the knockout library is not supported.');
    }
}());