/*global versions*/
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

    if (versions.jQueryUI.major < 1 ||
            (versions.jQueryUI.major === 1 && versions.jQueryUI.minor < 8)) {
        throw new Error('This version of the jQuery UI library is not supported.');
    }

    if (versions.knockout.major < 2 ||
            (versions.knockout.major === 2 && versions.knockout.minor < 2)) {
        throw new Error('This version of the knockout library is not supported.');
    }
}());