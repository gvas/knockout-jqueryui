/*global versions, bindingFactory*/
(function () {
    'use strict';

    var options;

    if (versions.jQueryUI.major === 1 && versions.jQueryUI.minor === 8) {
        options = ['disabled', 'value'];
    } else {
        options = ['disabled', 'max', 'value'];
    }

    bindingFactory.create({
        name: 'progressbar',
        options: options,
        events: ['change', 'create', 'complete']
    });
}());